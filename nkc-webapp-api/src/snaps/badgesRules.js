//const dynamodb = require('../shared/dynamodb');
//dynamodb.scan(params, (error, result) => {
//    
//});
var USER = null;
var VENUE = null;
var CHECKIN = null;
var BADGES = null;

/**
 * 
 * @param {type} venue_id
 * @param {type} checkin_time
 * @returns {undefined}
 */
function updateBadgesRulesStats(user_id, venue_id, checkin_time)
{
    //get badges list from rule group
    var venueBadges = getVenueBadges(venue_id);
    for (var i = 0; i < venueBadges.length; i++)
    {
        switch (venueBadges[i])
        {
            case 1:
                var done = allHubsCheckinsDone(user_id, venue_id, checkin_time);
                if(done)
                {
                    //update stats table and user badge
                }
                else
                {
                    //do nothing
                }
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
                var done = allGroupsCheckinsDone(user_id, venueBadges[i]);
                if(done)
                {
                    //update stats table and user badge
                }
                else
                {
                    //do nothing
                }
                break;

        }

    }
}

/**
 * @todo implement later
 * 
 * @param {type} venue_id
 * @returns {Array}
 */
function getVenueBadges(venue_id)
{
    return [];
}

/**
 * @todo implement later
 * 
 * @param {type} user_id
 * @param {type} last_venue_id
 * @param {type} last_venue_checkin_time
 * @returns {unresolved}
 */
function allHubsCheckinsDone(user_id, last_venue_id, last_venue_checkin_time)
{
    return last_venue_checkin_time;
    //or 
    //return false;
}

/**
 * @todo implement later 
 * 
 * @param {string} user_id
 * @param {string} badge_group_id
 * @returns {Boolean}
 */
function allGroupsCheckinsDone(user_id, badge_group_id)
{
    //fetch all venues of the badge_group_id
    // check in snaps if all venues are checked
//    return true or false accordingly
    return true;
}

/**
 * 
 * @param {string} user_id
 * @param {string} badge_id
 * @returns {Boolean}
 */
function setUserBadges(user_id, badge_id)
{
    return true;
}

/**
 * 
 * @param {string} user_id
 * @param {string} badge_id
 * @returns {Boolean}
 */
function isEligibleForBadge(user_id, badge_id)
{
    //check in badges and BadgesRulesStats tables and return true or false
    return false;
}
