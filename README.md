# Points Club Alexa Skill
Alexa skill for a fictional rewards company called Points Club.

At Points Club members receive points when buying on partner companies. Points can be exchanged by products or flight tickets.


## What the skill can do

| Member says                               | Points Club answers                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| What is my balance                        | Member's balance                                                         |
| Give more details *                       | Lists the last transactions, to best explain the current balance         |
| What can I buy with them? *               | Send offers based on balance value                                       |
| List my last transactions                 | List member's last transactions                                          |
| Do I have points close to expiration?     | Total points close to expiration                                         |
| Give more details **                      | Lists each transaction close to expiration                               |
| What can I buy with them? **              | Send offers based on total points close to expiration                    |
| What is the status of my last order       | Lists member's open orders                                               |
| How can I earn points?                    | Explains how to earn points                                              |
| Do I get points buying at Amazon?         | Tells if Amazon is an accrual partner                                    |
| What can I buy?                           | Explain what can be bought, and asks the member to choose                |
| Any good offers today?                    | Confirm and send the offers to the member                                |
| Which product can I buy with 1000 points? | Send offer links to the member                                           |
| I want to use a coupon                    | Ask coupon code, make a credit to member's account, and says how many points was credited  |
| I wanna travel to New York tomorrow       | Guide member through searching a flight ticket, inform price and availability, send the details to member's Facebook, and generate a lead to further phone contact |

\* right after listening its balance.

\*\* right after listening total points close to expiration.


## How members identify themselves

A member identify itself using a Facebook account.
Alexa companion app should guide members through the process.

Another option is to use Alexa webpage:
* go to https://alexa.amazon.com/spa/index.html
* select Skills > Your Skills
* select Points Club
* link a Facebook account

To test, there are 3 pre-defined Facebook users:

| Name                 | ID                 | E-mail                              | Member profile  |
| -------------------- | ------------------ | ----------------------------------- | --------------- |
| Jim Hopper           | 116848329105570	| jim_dhrqxky_hopper@tfbnw.net        | VIP member      |
| Will Byers           | 115070242617217	| will_jlmbefu_byers@tfbnw.net        | Standard member |
| Dustin Henderson     | 109150403209514	| dustin_sxznxxi_henderson@tfbnw.net  | New member      |

Switch between members to test all scenarios. To do that:

* logout Facebook or open an Incognito Window on Chrome
* go to https://alexa.amazon.com/spa/index.html
* select Skills > Your Skills
* select Points Club
* select Disable Skill
* select Enable Skill
* link another Facebook account

Important: at this point, any other user will not be registered on Points Club database. 
So, Points Club will not be able to establish a conversation.

## Flights

Skill is able to identify USA cities only.
There are flights from/to the following cities:

* DETROIT
* MIAMI
* BOSTON
* NEW YORK
* CHICAGO
* SEATTLE


## Partners

Current partners:

* Jet Blue
* Delta
* Virgin
* Amazon
* Walmart
* Verizon
* Gap
* Best Buy


## Coupons

Valid coupons:

* 12345
* 23456
* 34567
* 45678
* 56789
* 67890


## Implementation details

### Skill

Developed using Alexa Skills Kit SDK for Node.js

https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs

Features used:

* Skill State Management
* Dialog Interface
* Directive Service
* Multi-Language Support
* Speech Synthesis Markup Language (SSML)

Skill is hosted as an AWS Lambda function

The source can be found at folder `/alexa-skill`

To setup project dependencies

`npm install`


### Facebook

This skill can post on members timeline.


### E-mail

This skill do not send e-mails.


### Back-end

All data is obtained through calls to an external GraphQL API.

This API was build to mock real services, and it are not meant to be fully functional.

They are hosted on Graphcool:

https://www.graph.cool/

All live data can be queried here:

https://www.graphqlbin.com/JwLFB

The source can be found at folder `/backend-mock`


### Deploy at AWS

You can call ASK Client

Call `Points_Club> ask deploy`

But it will pack devDependencies, creating a large zip to upload.
You may find better to upload a zip file to Amazon S3.


### Unit tests

Call `Points_Club/lambda/custom> npm test`