import discord
from discord.ext import commands, tasks
import org_manager_api
import theimc
import secrets
import string

import os
os.environ['REQUESTS_CA_BUNDLE'] = os.path.join(
    '/etc/ssl/certs/',
    'ca-certificates.crt')

# API Server
API_SERVER = 'https://api.org-manager.space/1.0.0'
api = org_manager_api.OrgManagerAPI(API_SERVER, secrets.ORGANIZATION_ID)

# Prefix for calling bot in discord
client = commands.Bot(command_prefix='.')


# Runs on start to show bot is online
@client.event
async def on_ready():
    await client.change_presence(status=discord.Status.online, activity=discord.Game('.help'))
    print("Bot is ready")

    app_info = await client.application_info()
    print(f'https://discord.com/oauth2/authorize?client_id={app_info.id}&bot')


@client.command(brief='superadmin')
async def create_theimc_from_discord(ctx):
    if ctx.author.name == 'abrazite':
        theimc.create_org(api, create_api_context(ctx))


@client.command(brief='superadmin')
async def sync_theimc_from_discord(ctx):
    if ctx.author.name == 'abrazite':
        theimc.create_org(api, create_api_context(ctx))
        theimc.sync_org(api, create_api_context(ctx), ctx.message.channel.guild.members)


# Clear messages in chat
@client.command(brief='superadmin')
async def clear(ctx, amount=5):
    if ctx.author.name == 'abrazite':
        await ctx.channel.purge(limit=amount + 1)
        await ctx.send(f'{amount} Posts have been cleared')


@client.command(brief='Reports when user joined the org')
async def is_member(ctx, personnel_str):
    membership = api.membership(create_api_context(ctx), personnel_str)
    if membership:
        # todo(James): format date :)
        await ctx.send(f'joined {membership["joinedDate"]}')
    else:
        await ctx.send('no membership found')


@client.command(brief='Shows basic personnel info')
async def whois(ctx, *, personnel_str=None):
    if personnel_str:
        personnel = api.personnel_summary(create_api_context(ctx), personnel_str)
    else:
        personnel = api.personnel_summary(create_api_context(ctx), f'{ctx.author.name}#{ctx.author.discriminator}')

    if personnel:
        message_str = f'{full_formatted_nick(personnel)}\r'
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
    branches = api.branches(create_api_context(ctx), limit=LIMIT, page=page)
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
    grades = api.grades(create_api_context(ctx), limit=LIMIT, page=page)
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
    ranks = api.ranks(create_api_context(ctx), limit=LIMIT, page=page)
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
    certifications = api.certifications(create_api_context(ctx), limit=LIMIT, page=page)
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
        personnel = api.personnel(create_api_context(ctx), personnel_str)
    else:
        personnel = api.personnel(create_api_context(ctx), f'{ctx.author.name}#{ctx.author.discriminator}')

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
        personnel = api.personnel(create_api_context(ctx), personnel_str)
    else:
        personnel = api.personnel(create_api_context(ctx), f'{ctx.author.name}#{ctx.author.discriminator}')

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
        personnel = api.personnel(create_api_context(ctx), personnel_str)
    else:
        personnel = api.personnel(create_api_context(ctx), f'{ctx.author.name}#{ctx.author.discriminator}')

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
        personnel = api.personnel(create_api_context(ctx), personnel_str)
    else:
        personnel = api.personnel(create_api_context(ctx), f'{ctx.author.name}#{ctx.author.discriminator}')

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


@client.command(brief='Lists all personnel with filtering')
async def search_personnel(ctx, filter_str=None, page=0):
    LIMIT = 10
    summary = api.personnel_summary_all(create_api_context(ctx))
    list_str = ''

    summary = sorted(summary, key=lambda e: formatted_nick(e))

    count = 0
    total_count = 0
    for personnel in summary:
        include = filter_str is None
        include = include or (filter_str == personnel["gradeAbbreviation"])
        include = include or (filter_str == personnel["branchAbbreviation"])
        include = include or (filter_str == personnel["rankAbbreviation"])
        include = include or (filter_str == f'{personnel["branchAbbreviation"]}-{personnel["gradeAbbreviation"]}-{personnel["rankAbbreviation"]}')
        include = include or (filter_str == f'{personnel["branchAbbreviation"]}-{personnel["rankAbbreviation"]}')
        include = include or (filter_str == f'{personnel["citizenRecord"]}')
        include = include or (filter_str == f'{personnel["citizenName"]}')
        include = include or (filter_str == f'{personnel["handleName"]}')
        include = include or (filter_str == f'{personnel["username"]}#{personnel["discriminator"]}')

        if include:
            total_count += 1

        if include and count < LIMIT:
            list_str += f'{formatted_nick(personnel)}\r'
            count += 1

    if total_count > LIMIT:
        total_pages = int(total_count / LIMIT)
        list_str = f'(page {page} of {total_pages})\r\r' + list_str

    list_str += '\r'
    await ctx.send(list_str)


@client.command(brief='Create a new org branch')
async def create_branch(ctx, abbreviation: str, branch: str = None):
    record_id = api.create_branch(create_api_context(ctx), abbreviation, branch)
    if record_id:
        await ctx.send(f'created branch {abbreviation}')
    else:
        await ctx.send('error: no branch created')


@client.command(brief='Create a new org grade')
async def create_grade(ctx, abbreviation: str, grade: str = None):
    record_id = api.create_grade(create_api_context(ctx), abbreviation, grade)
    if record_id:
        await ctx.send(f'created grade {abbreviation}')
    else:
        await ctx.send('error: no grade created')


@client.command(brief='Create a new org grade')
async def create_rank(ctx, abbreviation: str, rank: str = None, branch_str: str = None, grade_str: str = None):
    record_id = api.create_rank(create_api_context(ctx), abbreviation, rank, branch_str, grade_str)
    if record_id:
        await ctx.send(f'created rank {abbreviation}')
    else:
        await ctx.send('error: no rank created')


@client.command(brief='Create a new certification')
async def create_certification(ctx, branch_str: str, abbreviation: str, name: str):
    record_id = api.create_certification(create_api_context(ctx), branch_str, abbreviation, name)
    if record_id:
        await ctx.send(f'created certification {abbreviation}')
    else:
        await ctx.send('error: no certification created')


@client.command(brief='Records certification')
async def record_cert(ctx, personnel_or_channel_str: str, certification_str: str):
    members = None
    for channel in ctx.message.channel.guild.voice_channels:
        if channel.name == personnel_or_channel_str:
            members = []
            for member in channel.members:
                personnel_str = f'{member.name}#{member.discriminator}'
                personnel = api.personnel_summary(create_api_context(ctx), personnel_str)
                if personnel:
                    members.append(personnel)

    if members is None:
        personnel = api.personnel_summary(create_api_context(ctx), personnel_or_channel_str)
        members = [personnel]

    records_str = ''
    for member in members:
        personnel_str = f'{member["username"]}#{member["discriminator"]}'
        record_id = api.record_cert(create_api_context(ctx), personnel_str, certification_str)
        if record_id:
            name = member["handleName"] if member["handleName"] else member["username"]
            records_str += f'updated {name}\r'

    if records_str != '':
        await ctx.send(records_str)
    else:
        await ctx.send('warning: no records updated')


@client.command(brief='Records operation attendance')
async def record_op(ctx, personnel_or_channel_str: str, op_name: str = None):
    members = None
    for channel in ctx.message.channel.guild.voice_channels:
        if channel.name == personnel_or_channel_str:
            members = []
            for member in channel.members:
                personnel_str = f'{member.name}#{member.discriminator}'
                personnel = api.personnel_summary(create_api_context(ctx), personnel_str)
                if personnel:
                    members.append(personnel)

    if members is None:
        personnel = api.personnel_summary(create_api_context(ctx), personnel_or_channel_str)
        members = [personnel]

    records_str = ''
    for member in members:
        personnel_str = f'{member["username"]}#{member["discriminator"]}'
        record_id = api.record_op(create_api_context(ctx), personnel_str, op_name)
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
                personnel = api.personnel_summary(create_api_context(ctx), personnel_str)
                if personnel:
                    members.append(personnel)

    if members is None:
        personnel = api.personnel_summary(create_api_context(ctx), personnel_or_channel_str)
        members = [personnel]

    records_str = ''
    for member in members:
        personnel_str = f'{member["username"]}#{member["discriminator"]}'
        record_id = api.record_note(create_api_context(ctx), f'{ctx.author.name}#{ctx.author.discriminator}', personnel_str, note)
        if record_id:
            name = member["handleName"] if member["handleName"] else member["username"]
            records_str += f'updated {name}\r'

    if records_str != '':
        await ctx.send(records_str)
    else:
        await ctx.send('warning: no records updated')


@client.command(brief='Creates all records for a new member')
async def add_member(ctx, discord_handle, sc_handle_name, rank_str, recruited_by_str=None):
    joined_date = ctx.message.channel.guild.get_member(discord_handle)
    record_id = api.add_member(create_api_context(ctx), discord_handle, sc_handle_name, rank_str, recruited_by_str, joined_date)

    if record_id:
        await ctx.send('member added')
    else:
        await ctx.send('error: could not add member')


@client.command(brief='Records personnel joining org - do not use with add_member')
async def record_joined_org(ctx, personnel_str, recruited_by_str=None):
    record_id = api.record_joined_org(create_api_context(ctx), personnel_str, recruited_by_str)

    if record_id:
        await ctx.send('joined org')
    else:
        await ctx.send('error: could not join org')


@client.command(brief='Records personnel leaving org')
async def record_left_org(ctx, personnel_str):
    record_id = api.record_left_org(create_api_context(ctx), personnel_str)

    if record_id:
        await ctx.send('left org')
    else:
        await ctx.send('error: could not leave org')


@client.command(brief='Changes users rank, grade, and branch')
async def change_rank(ctx, personnel_str, rank_str):
    record_id = api.change_rank(create_api_context(ctx), personnel_str, rank_str)

    personnel = api.personnel_summary(create_api_context(ctx), personnel_str)
    member = ctx.message.channel.guild.get_member_named(f'{personnel["username"]}#{personnel["discriminator"]}')
    if member is None:
        await ctx.send('error: could not change rank, no discord member found in guild')
        return

    if record_id:
        try:
            await member.edit(nick=formatted_nick(personnel))
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

    all_personnel = api.personnel_summary_all(create_api_context(ctx))
    if all_personnel is None:
        await ctx.send('error: could not lookup personnel')
        return

    for personnel in all_personnel:
        personnel_str = f'{personnel["username"]}#{personnel["discriminator"]}'
        member = ctx.message.channel.guild.get_member_named(personnel_str)

        if member:
            member_nick = member.nick if member.nick else member.display_name
            nick = formatted_nick(personnel)

            if member_nick != nick:
                report_users += f'{member_nick}\t -> \t {nick}'
                if correct_tags:
                    try:
                        await member.edit(nick=nick)
                    except:
                        report_users += '\tE'
                report_users += '\r'

    if len(report_users) > 0:
        await ctx.send(report_users)
    else:
        await ctx.send('all member tags are correct')


@client.command(brief='Validates user credentials')
async def validate(ctx):
    response = api.validate(create_api_context(ctx))
    await ctx.send(response)


def create_api_context(ctx) -> org_manager_api.APIContext:
    printable = set(string.printable)
    return org_manager_api.APIContext(
        ctx.author.id,
        ''.join(filter(lambda x: x in printable, ctx.author.name)),
        ctx.author.discriminator
    )


def formatted_nick(personnel) -> str:
    tag = personnel["rankAbbreviation"]
    name = personnel["handleName"] if personnel["handleName"] else personnel["username"]
    return f'[{tag}] {name}'


def full_formatted_nick(personnel) -> str:
    tag = ''
    if personnel["branchAbbreviation"]:
        tag += personnel["branchAbbreviation"] + '-'
    if personnel["gradeAbbreviation"]:
        tag += personnel["gradeAbbreviation"] + '-'
    if personnel["rankAbbreviation"]:
        tag += personnel["rankAbbreviation"]
    name = personnel["handleName"] if personnel["handleName"] else personnel["username"]

    return f'[{tag}] {name}'


client.run(secrets.CLIENT_KEY)
