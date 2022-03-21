# Privacy Policy

## What Discord data do you store? 

Upon adding the bot to your server:
- Guild ID

Upon registering w/ the LastFM commands:
- User ID

Upon registering w/ the Enable/Disable commands:
- Channel ID

## For what purpose(s) do you store it? 

- Guild and User IDs are both used to organize users' guild specific number of LastFM crowns, balances in the economy system, and "snitch terms".
- Channel IDs are used in preconditions to prevent commands from executing if they are blacklisted in the channel.

## For how long do you store it?

All documents in the database possess a timestamp pertaining to when they were created or updated. If 6 months have passed since the timestamp, the document will be deleted permanently.

## What is the process for users to request deletion of their data? 

Some data is deleted automatically:
- Guild IDs are deleted when the bot is kicked.
- User IDs are deleted when they unregister from commands.
- Channel IDs are deleted when a command is no longer blacklisted.

If users are still concerned, they are free to contact me directly through the support server.

## What systems and infrastructure do you use? 

The bot runs on DiscordJS and is hosted on an Ubuntu VPS.

## How have you secured access to your systems and infrastructure? 

2FA is used in all possible situations along with the use of SSH keys and whitelisting of IP addresses.

## How can users contact you with security issues? 

As aforementioend, they are free to contact me directly through the support server.

## Does your application utilize other third-party auth services or connections? If so, which, and why? 

Third-party auth services are not used per se.

However, the following services are used:
- Last.FM
- Genius

Users access these services by providing their usernames, nothing else. Of course, they can change their mind and revoke the bot's access to these usernames.
