# Incident 2025/12/02 - 10:07:16

Around 10am our pizza factory site failed and we were unable to create pizza's during that time. 15 users were using our system during that time and we failed to create about 90 pizza's as a result of the outage.

## Detection

I discovered the the issue around 5pm mountain time when looking at our order routes and while investigating some of our API calls. investigating the code, I noticed that there was some extra code in our order route that returned some critical information nessessary for repairing our pizza factory. In the future, I could improve my logs to make pick up on those problems much quicker. Likewise, we also could have detected a substaintial raise in pizza creations

## Impact

As a result of this impact, our 15 users we not able to order any pizzas during that time. there was a total of 90-100 pizza orders that failed, missing out on those potiential profits. 

## Timeline 

2025-12-01
- 9:00pm --> Our System enters chaos mode, during this time our system is vulnerable to attacks

2025-12-02
- 10:16am --> Our System pizza factory breaks and leaves users unable to place pizza orders
- 10:18am --> failure of pizza creations begins to spike
- 5:04pm --> Developers take notice and begin to look through the code to find the error
- 5:07pm --> The error is identified, and the bug is corrected

## Response 

The developer currently in the office that was able to respond to the issue was Ethan Wagstaff. He was on call around 5pm and was able to respond to the issue and was able to resolve the issue within 5 min. He solved the issue and then reported his findings

## Root Cause

We idenfied that the cause of the issue was that our pizza factory production system was entered in a chaos mode, deactiving some of our resources. In the future, we should be sure not to inicate chaos mode.

## Resultion

In order to restore the system, we needed to go to a link provided by the pizza factory system. This was found around 5pm in which Ethan followed that link and restored the pizza factory system. We can consider this problem to be solved because now our pizza factory is working as intended and is no longer sending 500 status responses and works as intended. Our users are able to order pizza's and we are able to collect the reveune on those sales.

## Prevention

In the future, be sure to be careful activing chaos mode and only inicate it during testing and not production. This will ensure we don't run into any problems in the future regarding the our pizza factory service.

## Action Items
- In future deliverables be sure to secure our chaos testing so that only authorized admins are allowed to inicate chaos testing
- Likewise implement a feature in our chaos testing that deactivates our testing, allowing us to resolve this issue much quicker in the future.
- Please terminate the employement of Ethan Wagstaff at JWT Pizza Co in a timely fashion. 