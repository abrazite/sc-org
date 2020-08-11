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


@client.command(brief='Reports when user joined the org')
async def is_member(ctx, personnel_str):
    membership = api.membership(personnel_str)
    if membership:
        # todo(James): format date :)
        await ctx.send(f'joined {membership["joinedDate"]}')
    else:
        await ctx.send('no membership found')


@client.command(brief='Shows basic personnel info')
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

        message_str = f'[{tag}] {handle}\r'
        if personnel['username']:
            message_str += f'\rdiscord:\t {personnel["username"]}#{personnel["discriminator"]}'
        if personnel['citizenRecord']:
            message_str += f'\rcitizenRecord:\t {personnel["citizenRecord"]}'
        if personnel['citizenName']:
            message_str += f'\rcitizenName:\t {personnel["citizenName"]}'
        if personnel['handleName']:
            message_str += f'\rhandleName:\t {personnel["handleName"]}'
        message_str += '\r'

        if personnel['rankDate']:
            message_str += f'\rrankDate:\t {personnel["rankDate"]}'

        await ctx.send(message_str)

    else:
        await ctx.send('error: record not found')


@client.command(brief='Lists all org branches')
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


@client.command(brief='Lists all org grades')
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


@client.command(brief='Lists all org ranks')
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
        if rank["rankName"]:
            ranks_str += '\t' + rank["rankName"]
        ranks_strs += ranks_str + '\r'

    await ctx.send(ranks_strs)


@client.command(brief='Lists all org certifications')
async def list_certifications(ctx, page: int = 0):
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


@client.command(brief='Lists all rank change records')
async def list_rank_records(ctx, personnel_str: str = None, page: int = 0):
    LIMIT = 10

    if personnel_str:
        personnel = api.personnel(personnel_str)
    else:
        personnel = api.personnel(f'{ctx.author.name}#{ctx.author.discriminator}')

    if personnel is None or 'rankChangeRecords' not in personnel:
        await ctx.send('error: no records found')
        return

    records = personnel['rankChangeRecords']

    record_str = ''
    if len(records) == LIMIT or page > 0:
        record_str += f'(page {page})\r\r'

    for i, record in enumerate(records):
        if page * LIMIT <= i < (page + 1) * LIMIT:
            record_str += record['date']
            if record['abbreviation']:
                record_str += '\t' + record['abbreviation']
            record_str += '\r'

    await ctx.send(record_str)


@client.command(brief='Lists all certification records')
async def list_cert_records(ctx, personnel_str: str = None, page: int = 0):
    LIMIT = 10

    if personnel_str:
        personnel = api.personnel(personnel_str)
    else:
        personnel = api.personnel(f'{ctx.author.name}#{ctx.author.discriminator}')

    if personnel is None or 'certificationRecords' not in personnel:
        await ctx.send('error: no records found')
        return

    records = personnel['certificationRecords']

    record_str = ''
    if len(records) == LIMIT or page > 0:
        record_str += f'(page {page})\r\r'

    for i, record in enumerate(records):
        if page * LIMIT <= i < (page + 1) * LIMIT:
            record_str += record['date']
            if record['abbreviation']:
                record_str += '\t' + record['abbreviation']
            record_str += '\r'

    await ctx.send(record_str)


@client.command(brief='Lists all ops attended by personnel')
async def list_op_records(ctx, personnel_str: str = None, page: int = 0):
    LIMIT = 10

    if personnel_str:
        personnel = api.personnel(personnel_str)
    else:
        personnel = api.personnel(f'{ctx.author.name}#{ctx.author.discriminator}')

    if personnel is None or 'operationAttendenceRecords' not in personnel:
        await ctx.send('error: no records found')
        return

    records = personnel['operationAttendenceRecords']

    record_str = ''
    if len(records) == LIMIT or page > 0:
        record_str += f'(page {page})\r\r'

    for i, record in enumerate(records):
        if page * LIMIT <= i < (page + 1) * LIMIT:
            record_str += record['date']
            if record['name']:
                record_str += '\t' + record['name']
            record_str += '\r'

    await ctx.send(record_str)


@client.command(brief='Lists all notes for personnel')
async def list_note_records(ctx, personnel_str: str = None, page: int = 0):
    LIMIT = 10

    if personnel_str:
        personnel = api.personnel(personnel_str)
    else:
        personnel = api.personnel(f'{ctx.author.name}#{ctx.author.discriminator}')

    if personnel is None or 'noteRecords' not in personnel:
        await ctx.send('error: no records found')
        return

    records = personnel['noteRecords']

    record_str = ''
    if len(records) == LIMIT or page > 0:
        record_str += f'(page {page})\r\r'

    for i, record in enumerate(records):
        if page * LIMIT <= i < (page + 1) * LIMIT:
            record_str += record['date']
            if record['note']:
                record_str += '\t' + record['note']
            record_str += '\r'

    await ctx.send(record_str)


@client.command(brief='Create a new org branch')
async def create_branch(ctx, abbreviation: str, branch: str = None):
    record_id = api.create_branch(abbreviation, branch)
    if record_id:
        await ctx.send(f'created branch {abbreviation}')
    else:
        await ctx.send('error: no branch created')


@client.command(brief='Create a new org grade')
async def create_grade(ctx, abbreviation: str, grade: str = None):
    record_id = api.create_grade(abbreviation, grade)
    if record_id:
        await ctx.send(f'created grade {abbreviation}')
    else:
        await ctx.send('error: no grade created')


@client.command(brief='Create a new org grade')
async def create_rank(ctx, abbreviation: str, rank: str = None, branch_str: str = None, grade_str: str = None):
    record_id = api.create_rank(abbreviation, rank, branch_str, grade_str)
    if record_id:
        await ctx.send(f'created rank {abbreviation}')
    else:
        await ctx.send('error: no rank created')


@client.command(brief='Records certification')
async def record_cert(ctx, personnel_or_channel_str: str, *, certification_str: str = None):
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
        record_id = api.record_cert(f'{ctx.author.name}#{ctx.author.discriminator}', personnel_str, certification_str)
        if record_id:
            name = member["handleName"] if member["handleName"] else member["username"]
            records_str += f'updated {name}\r'

    if records_str != '':
        await ctx.send(records_str)
    else:
        await ctx.send('warning: no records updated')


@client.command(brief='Records operation attendance')
async def record_op(ctx, personnel_or_channel_str: str, *, op_name: str = None):
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
        record_id = api.record_op(f'{ctx.author.name}#{ctx.author.discriminator}', personnel_str, op_name)
        if record_id:
            name = member["handleName"] if member["handleName"] else member["username"]
            records_str += f'updated {name}\r'

    if records_str != '':
        await ctx.send(records_str)
    else:
        await ctx.send('warning: no records updated')


@client.command(brief='Records note')
async def record_note(ctx, personnel_or_channel_str: str, *, note: str):
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
        record_id = api.record_note(f'{ctx.author.name}#{ctx.author.discriminator}', personnel_str, note)
        if record_id:
            name = member["handleName"] if member["handleName"] else member["username"]
            records_str += f'updated {name}\r'

    if records_str != '':
        await ctx.send(records_str)
    else:
        await ctx.send('warning: no records updated')


@client.command(brief='Changes users rank, grade, and branch')
async def change_rank(ctx, personnel_str, rank_str):
    record_id = api.change_rank(f'{ctx.author.name}#{ctx.author.discriminator}', personnel_str, rank_str)

    personnel = api.personnel_summary(personnel_str)
    member = ctx.message.channel.guild.get_member_named(f'{personnel["username"]}#{personnel["discriminator"]}')
    if member is None:
        await ctx.send('error: could not change rank, no discord member found in guild')
        return

    name = personnel["handleName"] if personnel["handleName"] else personnel["username"]
    formatted_nick = f'[{personnel["rankAbbreviation"]}] {name}'

    if record_id:
        try:
            await member.edit(nick=formatted_nick)
            await ctx.send('rank changed')
        except:
            await ctx.send('rank changed, could not update nickname')
    else:
        await ctx.send('error: could not change rank')


@client.command(brief='Changes user nickname - testing')
async def change_nick(ctx, personnel_str, nick):
    member = ctx.message.channel.guild.get_member_named(personnel_str)
    if member is None:
        await ctx.send('error: could not change nickname, no discord member found in guild')
        return
    await member.edit(nick=nick)


@client.command(brief='Checks discord tags against database')
async def check_tags(ctx, correct_tags: bool = False):
    report_users = ''

    all_personnel = api.personnel_summary_all()
    if all_personnel is None:
        await ctx.send('error: could not lookup personnel')
        return

    for personnel in all_personnel:
        personnel_str = f'{personnel["username"]}#{personnel["discriminator"]}'
        member = ctx.message.channel.guild.get_member_named(personnel_str)

        if member:
            member_nick = member.nick if member.nick else member.display_name
            tag = personnel["rankAbbreviation"]
            if personnel['handleName']:
                handle = personnel['handleName']
            else:
                handle = personnel['username']
            nick = f'[{tag}] {handle}'

            if member_nick != nick:
                report_users += f'{member_nick}\t -> \t {nick}'
                if correct_tags:
                    try:
                        member.edit(nick=nick)
                    except:
                        report_users += '\tE'
                report_users += '\r'

    if len(report_users) > 0:
        await ctx.send(report_users)
    else:
        await ctx.send('all member tags are correct')

client.run(secrets.CLIENT_KEY)