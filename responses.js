var responses = {
    fail: [
        "Can't do that you bloody dingle doink",
        "'I somlemly swear that I'm up to no good' ~ You",
        "Nice try guy",
        "You should work on bettering yourself you worthless meatbag, get it right next time",
        "Why did you even trying to do that?",
        "WTF you need to stop shittin the bed",
        "How about you go play in the mud you utter fuck up",
        "Fail, This doesn't prove jet fuel melts steel beams",
        "Nice try guy but that shit don't work on me.",
        "You think I'm that dumb?",
        "undefined, like your inteligence",
        "(1D107 Error)"
    ],
    success: [
        "Good job, you earn one token. It does nothing but just be happy",
        "Well done barrel drum",
        "Hey congrats, the first useful thing you've done all day"
    ]
}

exports.getFailResponse = function() {
    return responses.fail[Math.floor((Math.random() * responses.fail.length))]
}

exports.getSuccessResponse = function() {
    return responses.fail[Math.floor((Math.random() * responses.fail.length) + 1)]
}