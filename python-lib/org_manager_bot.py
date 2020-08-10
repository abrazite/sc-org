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
    await client.change_presence(status=discord.Status.online, activity=discord.Game('Testing!'))
    print("Bot is ready")


# Ping test for responce and responce time & roounds to ms
@client.command()
async def ping(ctx):
    await ctx.send(f'{round(client.latency * 1000)}ms')


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
async def whois(ctx, personnel_str):
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


# Change a users rank and record the discord member who issued it
@client.command()
async def change_rank(ctx, personnel_str, rank_str):
    record_id = api.change_rank(f'{ctx.author.name}#{ctx.author.discriminator}', personnel_str, rank_str)

    personnel = api.personnel_summary('abrazite')

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
