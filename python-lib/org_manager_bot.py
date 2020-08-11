import discord
from discord.ext import commands, tasks
import org_manager_api
import secrets

# API Server
API_SERVER = 'https://li1958-117.members.linode.com/1.0.0/'
ORGANIZATION_ID = '4b40e446-5ceb-4543-a6d8-fa4e28a00406'
api = org_manager_api.OrgManagerAPI(API_SERVER, ORGANIZATION_ID)

# Prefix for calling bot in discord
client = commands.Bot(command_prefix = '.')


# Runs on start to show bot is online
@client.event
async def on_ready():
    await client.change_presence(status=discord.Status.online, activity=discord.Game('.help'))
    print("Bot is ready")


# Clear messages in chat
@client.command()
async def clear(ctx, amount=5):
    await ctx.channel.purge(limit=amount + 1)
    await ctx.send(f'{amount} Posts have been cleared')


# Command to check if member is in the Database
@client.command()
async def is_member(ctx, personnel_str):
    membership = api.membership(personnel_str)
    if membership:
        # todo(James): format date :)
        await ctx.send(f'joined {membership["joinedDate"]}')
    else:
        await ctx.send('no membership found')


# Provide basic info on personnel
@client.command()
async def whois(ctx, *, personnel_str=None):
    if personnel_str:
        personnel = api.personnel_summary(personnel_str)
    else:
        personnel = api.personnel_summary(f'{ctx.author.name}#{ctx.author.discriminator}')

    if personnel:
        tag = ''
        if personnel["branchAbbreviation"]:
            tag += personnel["branchAbbreviation"] + '-'
        if personnel["gradeAbbreviation"]:
            tag += personnel["gradeAbbreviation"] + '-'
        if personnel["rankAbbreviation"]:
            tag += personnel["rankAbbreviation"]
        if personnel['handleName']:
            handle = personnel['handleName']
        else:
            handle = personnel['username']

        await ctx.send(f'[{tag}] {handle}')

    else:
        await ctx.send('error: record not found')


# Show all ranks
@client.command()
async def list_branches(ctx, page=0):
    LIMIT = 10
    branches = api.branches(limit=LIMIT, page=page)
    branches_strs = ''

    if len(branches) == LIMIT or page > 0:
        branches_strs += f'(page {page})\r\r'

    for branch in branches:
        branch_str = branch["abbreviation"]
        if branch["branch"]:
            branch_str += '\t' + branch["branch"] + '\r'
        branches_strs += branch_str

    await ctx.send(branches_strs)


# Show all grades
@client.command()
async def list_grades(ctx, page=0):
    LIMIT = 10
    grades = api.grades(limit=LIMIT, page=page)
    grades_strs = ''

    if len(grades) == LIMIT or page > 0:
        grades_strs += f'(page {page})\r\r'

    for grade in grades:
        grade_str = grade["abbreviation"]
        if grade["grade"]:
            grade_str += '\t' + grade["grade"]
        grades_strs += grade_str + '\r'

    await ctx.send(grades_strs)


# Show all ranks
@client.command()
async def list_ranks(ctx, page=0):
    LIMIT = 10
    ranks = api.ranks(limit=LIMIT, page=page)
    ranks_strs = ''

    if len(ranks) == LIMIT or page > 0:
        ranks_strs += f'(page {page})\r\r'

    for rank in ranks:
        ranks_str = ''
        if rank["branchAbbreviation"]:
            ranks_str += rank["branchAbbreviation"] + '-'
        if rank["gradeAbbreviation"]:
            ranks_str += rank["gradeAbbreviation"] + '-'
        if rank["rankAbbreviation"]:
            ranks_str += rank["rankAbbreviation"]
        if rank["name"]:
            ranks_str += '\t' + rank["name"]
        ranks_strs += ranks_str + '\r'

    await ctx.send(ranks_strs)


# Show all certifications
@client.command()
async def list_certifications(ctx, page=0):
    LIMIT = 10
    certifications = api.certifications(limit=LIMIT, page=page)
    certifications_strs = ''

    if len(certifications) == LIMIT or page > 0:
        certifications_strs += f'(page {page})\r\r'

    for certification in certifications:
        certification_str = certification["abbreviation"]
        if certification["name"]:
            certification_str += '\t' + certification["name"]
        certifications_strs += certification_str + '\r'

    await ctx.send(certifications_strs)


# list all ops attended by personnel
@client.command()
async def list_op_attendence(ctx, personnel_str: str = None):
    if personnel_str:
        personnel = api.personnel(personnel_str)
    else:
        personnel = api.personnel(f'{ctx.author.name}#{ctx.author.discriminator}')

    if personnel is None:
        await ctx.send('error: no records found')
        return

    op_str = ''
    for op in personnel['operationAttendenceRecords']:
        op_str += op['date']
        if op['name']:
            op_str += '\t' + op['name']
        op_str += '\r'

    await ctx.send(op_str)

# Change a users rank and record the discord member who issued it
@client.command()
async def add_op_attendence(ctx, personnel_or_channel_str: str, *, op_name: str = None):
    members = None
    for channel in ctx.message.channel.guild.voice_channels:
        if channel.name == personnel_or_channel_str:
            members = []
            for member in channel.members:
                personnel_str = f'{member.name}#{member.discriminator}'
                personnel = api.personnel_summary(personnel_str)
                if personnel:
                    members.append(personnel)

    if members is None:
        personnel = api.personnel_summary(personnel_or_channel_str)
        members = [personnel]

    records_str = ''
    for member in members:
        personnel_str = f'{member["username"]}#{member["discriminator"]}'
        record_id = api.add_op_attendence(f'{ctx.author.name}#{ctx.author.discriminator}', personnel_str, op_name)
        if record_id:
            name = member["handleName"] if member["handleName"] else member["username"]
            records_str += f'updated {name}\r'

    if records_str != '':
        await ctx.send(records_str)
    else:
        await ctx.send('warning: no records updated')


# Change a users rank and record the discord member who issued it
@client.command()
async def change_rank(ctx, personnel_str, rank_str):
    record_id = api.change_rank(f'{ctx.author.name}#{ctx.author.discriminator}', personnel_str, rank_str)

    personnel = api.personnel_summary(personnel_str)
    member = ctx.message.channel.guild.get_member_named(f'{personnel["username"]}#{personnel["discriminator"]}')
    if member is None:
        await ctx.send('error: could not change rank, no discord member found in guild')
        return

    name = personnel["handleName"] if personnel["handleName"] else personnel["username"]
    formatted_nick = f'[{personnel["rankAbbreviation"]}] {name}'

    await member.edit(nick=formatted_nick)
    if record_id:
        await ctx.send('rank changed')
    else:
        await ctx.send('error: could not change rank')


@client.command()
async def change_nick(ctx, personnel_str, nick):
    member = ctx.message.channel.guild.get_member_named(personnel_str)
    if member is None:
        await ctx.send('error: could not change nickname, no discord member found in guild')
        return
    await member.edit(nick=nick)

client.run(secrets.CLIENT_KEY)
