# IsenBot
A simple [Discord](https://discordapp.com/) bot written on top of [Discordie](https://github.com/qeled/discordie).\

### Current Features
----
- Kick & Vote Kick
    - Vote kick will require minimum 2 people in order to kick someone   
- Ban & Vote ban
    -  Vote Ban will require minimum 2 people in order to Ban someone  
- Promote


#### Kick & Vote Kick
----
Used to give users the ability to kick people. Vote Kick should be used in general.

***Usage:*** 
```
!kick @User#1234 | @IsenBot kick @User#1234 (kick specified user from server)
!votekick @User#1234 | @IsenBot votekick @User#1234 (kicks specified userfrom server)
```

#### Ban & Vote ban
----
Used to give users the ability to ban people. Vote ban should be used to restrict power struggles.

***Usage:*** 
```
!ban @User#1234 | @IsenBot ban @User#1234 (Bans specified user from server)
!voteban @User#1234 | @IsenBot voteban @User#1234 (Bans specified from server)
```

#### Promote
----
This can be used so the users without the permissions to assign roles are able to promote others up to their level. Level of roles is based on the ordering of the created roles.

***Usage:*** 
```
!promote @User#1234 | @IsenBot promote @User#1234 (Promotes specified user up one level role)
!promote @User#1234 newb | @IsenBot promote @User#1234 newb (Promotes user to 'newb' role if less than your equal to their current role)
```


