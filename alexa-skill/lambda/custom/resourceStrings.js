'use strict'

const resourceStrings = {
    en: {
        translation: {
            
            WELCOME_POINTS_CLUB:`
                <p><prosody volume="loud">Welcome to Points Club %s!</prosody></p>
                <p>What can I do for you today?</p>`,
                
            USER_NOT_FOUND:`
                <say-as interpret-as="interjection">Ouch!</say-as> 
                <p>I am sorry. I did not find you.</p>
                <p>Make sure you linked me with your Facebook account.</p>`,
                
            SAY_HIGH_BALANCE:`
                <emphasis level="strong">Great!</emphasis> Your balance is %s points.`,
                
            SAY_BALANCE:`
                Your balance is %s points.`,
                
            SAY_ZERO_BALANCE:`
                <p><say-as interpret-as="interjection">Ouch!</say-as> You have no point yet.</p>
                <p>But I have several tips for you to earn points.</p>
                <p>You may ask me this if you want.</p>`,
                
            NO_ORDER_FOUND:`
                <say-as interpret-as="interjection">Shucks!</say-as>
                <p>I have not found any open order from you.</p> 
                <p>If you have ordered something, please call us at <say-as interpret-as='telephone'>1023233059</say-as>.</p>
                <break time='200ms'/>
                <p>I will repeat it for you.</p>
                <break time='200ms'/>
                <say-as interpret-as='telephone'>1023233059</say-as>`,
                
            ORDER_FOUND:`
                <p>I checked that you have %s order%s in progress.</p>`,
                
            ORDER_BEING_DELIVERED:`
                <p>Your %s is on the way, and will be delivered %s.</p>`,
                
            ORDER_BEING_PROCESSED:`
                <p>Your %s order is still being processed.</p>
                <p>It will be delivered in about %s days.</p>`,
                
            NO_RECENT_TRANSACTIONS_FOUND:`
                I have not found any recent transaction.`,
                
            ONE_RECENT_TRANSACTION_FOUND:`
                <p>I checked that you have just on recent transaction.</p>
                <p>It is:</p>`,
                
            RECENT_TRANSACTIONS_FOUND:`
                <p>I checked that you have %s recent transactions.</p>
                <p>They are:</p>`,
                
            DETAIL_TRANSACTION:`
                <p>A %s of %s on 
                <say-as interpret-as="date">????%s</say-as> 
                at %s.</p>`,
                
            NO_EXPIRING_POINTS_FOUND:`
                That's great! I have not found any points expiring in the next 6 months.`,
                
            EXPIRING_POINTS_FOUND_1_D:  `
                <p><say-as interpret-as="interjection">Heads up!</say-as></p> <p>I have found %s points expiring today.</p>
                <p>Hurry up, order something today!</p>`,
                
            EXPIRING_POINTS_FOUND_7_D:  `
                <p><say-as interpret-as="interjection">Heads up!</say-as></p> <p>I have found %s points expiring during this week.</p>
                <p>Hurry up, order something today!</p>`,
                
            EXPIRING_POINTS_FOUND_30_D:  `
                <p><say-as interpret-as="interjection">Heads up!</say-as></p> <p>I have found %s points expiring during this month.</p>
                <p>Hurry up, order something today!</p>`,
                
            EXPIRING_POINTS_FOUND_180_D:  `
                I have not found any points expiring during this month, 
                but you have %s points expiring in the next 6 months`,
                
            ACCRUAL_TIPS:`
                <say-as interpret-as="interjection">Spoiler alert!</say-as> It is really easy to earn points.
                <p>Just identify yourself as a member when flying with our associated airlines: Jet Blue, Delta and Virgin.</p>
                <p>When buying online you may see our logo on your favorite marketplace, just identify yourself during check out and you are good to go.</p>
                <p>That is it! <say-as interpret-as="interjection">Good luck!</say-as></p>`,
                
            ACCRUAL_PARTNER_FOUND:`
                <p><emphasis>Sure!</emphasis> %s is our partner.</p>
                <p>You receive points buying from them.</p>`,
                
            ACCRUAL_PARTNER_NOT_KNOWN:`
                I am sorry but I did not know this partner.`,
                
            REDEEM_OPTIONS:`
                <p>You can redeem an flight ticket, or a wide variety of products.</p>
                <p>Do you want a flight ticket or a product?</p>`,

            REDEEM_OPTIONS_FOR_BALANCE:`
                <p>I have found special offers for your %s points!</p>
                <p>I just sent them to your email.</p>
                <p><say-as interpret-as="interjection">Check it out!</say-as></p>`,
                
            REDEEM_OPTIONS_FOR_ZERO_BALANCE:`
                <p>I am sorry! You must have points to buy something.</p>`,

            REDEEM_OPTIONS_FOR_BALANCE_ALT:`
                <p>I checked that you have a balance of %s points, and I have found special offers for you just below that!</p>
                <p>I just sent them to your email.</p>
                <p><say-as interpret-as="interjection">Check it out!</say-as></p>`,

            REDEEM_OPTIONS_FOR_NO_EXPIRING_POINTS:`
                <p>I have no points expiring soon, but I have found special offers for your %s points!</p>
                <p>I just sent them to your email.</p>
                <p><say-as interpret-as="interjection">Check it out!</say-as></p>`,

            REDEEM_OPTIONS_FOR_EXPIRING_POINTS:`
                <p>I have found special offers for your %s expiring points!</p>
                <p>I just sent them to your email.</p>
                <p><say-as interpret-as="interjection">Check it out!</say-as></p>`,
                
            REDEEM_OPTIONS_FOR_DEFINED_POINTS:`
                <p>I have found special offers for you just below %s points!</p>
                <p>I just sent them to your email.</p>
                <p><say-as interpret-as="interjection">Check it out!</say-as></p>`,
                
            FLIGHT_NOT_FOUND:`
                <p>I am sorry, but I have not found any flights from %s to %s.</p>`,

            FLIGHT_FOUND:`
                <p>I found %s flights from %s to %s on <say-as interpret-as="date">%s</say-as>.</p>
                <p>The best price is %s points, at <say-as interpret-as="time">%s</say-as>.</p>
                <p>Would you like to receive a call from us to complete the process?</p>`,
                
            FLIGHT_FOUND_TEXT:'Flight from %s to %s, on %s %s, using %s points. ' +
                'To confirm your ticket go to: https://multipl.us?id=123',
                
            FLIGHT_FOUND_WITH_RETURN:`
                <p>I found %s flights from %s to %s on <say-as interpret-as="date">%s</say-as>, 
                returning on <say-as interpret-as="date">%s</say-as>.</p>
                <p>The best price is %s points, at <say-as interpret-as="time">%s</say-as>.</p>
                <p>Would you like to receive a call from us to complete the process?</p>`,
                
            FLIGHT_FOUND_FB:`
                <p>I found %s flights from %s to %s on <say-as interpret-as="date">%s</say-as>.</p>
                <p>The best price is %s points, at <say-as interpret-as="time">%s</say-as>.</p>
                <p>I've sent the details on Facebook for you.</p>
                <p>Would you like to receive a call from us to complete the process?</p>`,
                
            FLIGHT_FOUND_WITH_RETURN_FB:`
                <p>I found %s flights from %s to %s on <say-as interpret-as="date">%s</say-as>, 
                returning on <say-as interpret-as="date">%s</say-as>.</p>
                <p>The best price is %s points, at <say-as interpret-as="time">%s</say-as>.</p>
                <p>I've sent the details on Facebook for you.</p>
                <p>Would you like to receive a call from us to complete the process?</p>`,
                
            FLIGHT_FOUND_WITH_RETURN_TEXT:'Flight from %s to %s, on %s %s, returning on %s, using %s points. ' +
                'To confirm your ticket go to: https://multipl.us?id=123',
                
            FLIGHT_ORIGIN_ELICIT:`
                Okay, where would you like to fly from?`,
                
            FLIGHT_ORIGIN_HOME_TOWN_CONFIRMATION:`
                You live in %s. Do you want to fly from there?`,
                
            FLIGHT_ORIGIN_CONFIRMATION:`
                You want to fly from %s, is that correct?`,
                
            FLIGHT_DESTINATION_ASK:`
                Where would you like to fly to?`,    
                
            FLIGHT_DESTINATION_ELICIT:`
                Okay, where would you like to fly to?`,
                
            FLIGHT_DESTINATION_CONFIRMATION:`
                You would like to fly to %s, is that correct?`,
                
            FLIGHT_DATE_ASK:`
                When would you like to fly?`,    
                
            FLIGHT_DATE_ELICIT:`
                Okay, When would you like to fly?`,
                
            FLIGHT_DATE_CONFIRMATION:`
                You would like to fly at %s, is that correct?`,
                
            FLIGHT_RETURN_TICKET_CONFIRMATION:`
                Would you like a return ticket?`,
                
            FLIGHT_RETURN_TICKET_ASK:`
                When would you like to fly back to %s?`,
                
            FLIGHT_RETURN_DATE_CONFIRMATION:`
                You would like to fly back at %s, is that correct?`,
                
            FLIGHT_RETURN_DATE_ELICIT:`
                Okay, When would you like to fly back?`,
            
            FLIGHT_SEARCHING:`
                Just a second. I am searching flights for you.`,

            FLIGHT_CONFIRMATION:`
                Ok! We will be in touch soon. <say-as interpret-as="interjection">Bon voyage!</say-as>`,
                
            FLIGHT_DENIED:`
                Ok!`,
            
            VOUCHER_ELICIT:`
                Say your five digit coupon, digit by digit`,

            VOUCHER_CONFIRMATION:`
                Your coupon is <say-as interpret-as="spell-out">%s</say-as>, is that correct?`,
                
            USE_VOUCHER_CONFIRMATION:`
                <say-as interpret-as="interjection">You bet!</say-as>
                <p>Your coupon has been activated.</p> 
                <p>You received %s points.</p>`,

            VOUCHER_INVALID:`
                I am sorry but I could not find your coupon.`,

            SPECIAL_OFFERS_FOUND:`
                <p>I have a special offer today!</p>
                <p>I just sent it to your email.</p>
                <p><say-as interpret-as="interjection">Check it out!</say-as></p>`,
                
            DETAIL_BALANCE:`
                <p>Ok! I will list your last transactions so you understand your balance better.</p>
                <p>They are:</p>`,
                
            DETAIL_EXPIRING_POINTS:`
                <p>Ok! I will list the accruals that are closer to expiring.</p>
                <p>They are:</p>`,
                
            EXPIRING_ACCRUAL:`
                <p>An accrual of %s points from %s will expire on <say-as interpret-as="date">%s</say-as>.</p>`,
                
            ANYTHING_ELSE:`
                <break time='100ms'/>
                <p>Anything else I can help?</p>`,

            THATS_ALL_I_KNOW:`
                <p>That is all I know so far!</p>`,  
                  
            HELP:  `
                <emphasis>Hi</emphasis>, this is Points Club. 
                <p>I can tell you what your balance is,</p>
                <p>your points that will expire,</p> 
                <p>list your last transactions,</p> 
                <p>the status of your recent orders,</p> 
                <p>explain how to earn points,</p> 
                <p>confirm if you get points buying from a company,</p> 
                <p>credit coupons,</p> 
                <p>tell you about promotions,</p> 
                <p>find flight tickets,</p> 
                <p>and suggest products.</p> 
                <p>What can I do for you today?</p>`,
                
            UNHANDLED:`
                <say-as interpret-as="interjection">uh oh!</say-as>. 
                <p>I'm a little embarrassed, I still have not learned to do this.</p>
                <p>You may say <emphasis level="reduced">help</emphasis> and I tell you what I can do.</p>`,

            ERROR:`
                <say-as interpret-as="interjection">uh oh!</say-as>. 
                <p>I'm a little embarrassed, cos I made some mistake.</p>
                <p>I will not be able to answer that.</p>`,

            GOOD_BYE:`
                <say-as interpret-as="interjection">Au revoir!</say-as>`,
            
            REPROMPT:`
                <p>Hello! Are you still there?</p>`
        }
    }
}

module.exports = resourceStrings