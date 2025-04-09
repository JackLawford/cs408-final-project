# Click Racer

## Project Spec

Overview: This project will be a simple drag racing web game focused on reaction time.

Functionality: Being focused on reaction time in the context of drag racing, the user should open with a prompt to start the game or view the leaderboard. Upon clicking start game, the user will be displayed a simple drag strip graphic with a vehicle on it and the classic drag racing "tree" lights signaling them when to go. Throttle will be controlled by holding down left mouse button on the game's canvas. If the user "jumps" the light, or clicks before the light turns green, a false start pop-up will be displayed and the user will be sent back to the initial screen and given a score of DNF (did not finish). If the user presses down their left mouse button after the green light is displayed, the car will take off down the track. Once the car reaches the end of the track, a time will be displayed. This will likely be a constant value with the user's reaction time subtracted from it. The user will then be prompted to attach a name to their score and it will be inserted into the database with their name and time. 

Target Audience: This app will be heavily inspired by older flash game websites such as CoolMathGames, MiniClip, Kongregate, etc. That being said, simple games are typically consumed and enjoyed by children. This game will be designed with that in mind, as well as users that may be car enthusiasts or simply people looking for a lighthearted pastime.

Data: The only data I intend to dynamically manage with the backend will be the leaderboard. The leaderboard can be implemented as a separate page to help satisfy the 3-page minimum requirement. This data should have 4 values: Username, Final Race Time, Reaction Time, and a Timestamp. This can then be sorted from least to greatest by Final Race Time, putting those with the lowest time at the top of the leaderboard. 

Stretch Goals: An additional feature I would like to add is the ability to do a "burnout" before the countdown and race. This would add more variety to the scoring system, as a perfect burnout should make the user's score better while a poor burnout could negatively impact their score. This would make the game more enjoyable and engaging, but it isn't a necessary core component to get a proof of concept published.

## Project Wireframe

![wireframe](408mockup.png)
