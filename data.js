// data.js — bulk data constants extracted from the main page in Phase F.
// Loaded via a script tag before the main inline script in index.html.
// Non-module script scope means these constants are visible to the inline
// script that follows.
//
// To re-inline these for any reason, paste each block back into the original
// location in index.html (look for the "moved to data.js" marker comments).

// ROUND2_SCENARIOS
const ROUND2_SCENARIOS = {
  CRISIS: {
    id: 'CRISIS',
    context: "A project with your name on it is failing, and it's due in 48 hours.",
    responses: {
      'MONO-W': 'Share the extra hours out evenly, starting with mine.',
      'MONO-U': "Stop all work until I know exactly why it's failing.",
      'MONO-B': 'Get to the people who decide what counts as failure, before anyone else.',
      'MONO-R': 'Clear my diary and throw myself at it.',
      'MONO-G': "Go back to the way we've always done it.",
      'AZORIUS': 'Write one plan, with a named job for each person.',
      'DIMIR': "Keep it quiet until it's fixed.",
      'RAKDOS': 'Bin the plan and do whatever works.',
      'GRUUL': 'Strip it back to the simple version that works.',
      'SELESNYA': "Get everyone into one room and keep an eye on how they're coping.",
      'ORZHOV': "Call in the favours I'm owed, and reward the ones who come through.",
      'IZZET': 'Rig up three quick fixes and keep whichever works.',
      'GOLGARI': "This version's dead. The next one gets the parts that still work.",
      'BOROS': "Own it publicly, then drive everyone flat out until it's fixed.",
      'SIMIC': 'Work down the breaks, worst first.',
      'BANT': 'Check the numbers, then pace the work so nobody burns out.',
      'ESPER': "Take every decision myself until it's done.",
      'GRIXIS': 'Push everyone hard down the fastest route to a result.',
      'JUND': "Cut the weak parts and throw everything at what's left.",
      'NAYA': "I'd be in there with them all night, keeping spirits up.",
      'ABZAN': "Put the old hands who've rescued projects before in charge of it.",
      'JESKAI': 'Drill one clear plan with everyone until it runs smoothly.',
      'SULTAI': "Save what's worth saving, and note who held up under pressure.",
      'MARDU': "Pull everyone off other work until it's done.",
      'TEMUR': 'Ten minutes to understand it. After that, change course as it changes.',
      'WITCH': 'Find out whether the 48 hours is fixed before anyone panics.',
      'GLINT': "Go over everyone's heads to get the deadline moved.",
      'DUNE': 'Everyone on the obvious faults now. We can talk later.',
      'INK': "Make sure nobody's blamed, even if we miss the deadline.",
      'YORE': 'Start again from scratch with the sharpest people I have.',
      'WUBRG': "Depends what's broken. A late supplier and a bad design need different fixes."
    }
  },
  CONFLICT: {
    id: 'CONFLICT',
    context: "Two people in a group you run are arguing hard over a decision you'll have to answer for.",
    responses: {
      'MONO-W': 'Decide by the rules we agreed.',
      'MONO-U': 'Ask each for their evidence in writing first.',
      'MONO-B': "It's my call, so I'd make it today.",
      'MONO-R': 'Have it out in the open, now.',
      'MONO-G': 'Leave it alone for a while.',
      'AZORIUS': 'Write down the criteria first, and judge both cases against them.',
      'DIMIR': 'Talk to each alone, listening for what they leave out.',
      'RAKDOS': 'Back whichever of them wants it more.',
      'GRUUL': 'Go with my gut and tell them straight.',
      'SELESNYA': 'Sit them down together, as often as it takes, until they agree.',
      'ORZHOV': 'Let the more senior of the two decide.',
      'IZZET': 'Run both side by side for a fortnight.',
      'GOLGARI': "One idea has to go. I'd keep its best parts for later.",
      'BOROS': "Decide what's right, then hold both of them to it.",
      'SIMIC': 'Graft the strongest part of one onto the other.',
      'BANT': 'Take a week to ask everyone it affects, then find a version all can accept.',
      'ESPER': "I'd decide alone, on the numbers.",
      'GRIXIS': 'Get them to pitch it to me tomorrow, head to head.',
      'JUND': 'Let them argue it out until one gives up.',
      'NAYA': "Remind both what we're here for, then let the whole group decide.",
      'ABZAN': "Go with the safer idea, the one closer to what's served us before.",
      'JESKAI': "Run it as a debate, with each arguing the other's side.",
      'SULTAI': 'Watch quietly to see which of them holds up.',
      'MARDU': 'They get an hour to agree. After that, I decide.',
      'TEMUR': 'Test both against the worst case, and use the tougher one.',
      'WITCH': 'Let tempers cool for a few days, then compare the facts.',
      'GLINT': 'Whatever makes us more money wins.',
      'DUNE': "Pick one and start. We'll know within a week if it's wrong.",
      'INK': "Choose the one that's kinder to the people it affects.",
      'YORE': 'Ask them both for a third idea that beats theirs.',
      'WUBRG': "Depends on the argument. If it's about facts, I'd check them myself."
    }
  },
  PIVOT: {
    id: 'PIVOT',
    context: "You're offered a job doing what you love. It pays less and might not last.",
    responses: {
      'MONO-W': "Talk it through with my family first. They'd carry the risk too.",
      'MONO-U': 'Read their accounts and business plan, every page, before deciding.',
      'MONO-B': 'Only if I get a stake in the business.',
      'MONO-R': "Yes. I've wanted this for years.",
      'MONO-G': "Stay. I've built a good life where I am.",
      'AZORIUS': 'Only after a full handover, so nobody here is left in the lurch.',
      'DIMIR': 'Use the offer to get a rise where I am.',
      'RAKDOS': 'Take it and enjoy every minute while it lasts.',
      'GRUUL': 'Go. My gut decided long ago.',
      'SELESNYA': "If they're good people to work with, I'll go.",
      'ORZHOV': "Go, if they'll put me in charge of something.",
      'IZZET': "Treat it as a year-long experiment. I'll learn either way.",
      'GOLGARI': 'My current job has run its course, so yes.',
      'BOROS': "I'm in, all the way, from the first day.",
      'SIMIC': "Accept, and grow into the parts I can't do yet.",
      'BANT': 'Ask them to wait six months while I save up a cushion.',
      'ESPER': 'Accept on terms I set, with security written in.',
      'GRIXIS': "Take it as a stepping stone. In a few years I'll run my own.",
      'JUND': 'Take it. Nobody there will outwork me.',
      'NAYA': 'Go for it. My friends will back me if it folds.',
      'ABZAN': 'Turn it down. I need work that will last until I retire.',
      'JESKAI': "Yes. I'd finally have the time to master the craft.",
      'SULTAI': 'Not yet. A better offer will come once the right people know my work.',
      'MARDU': 'Accept today and hand in my notice tomorrow.',
      'TEMUR': 'Yes, if I can shape the job as I go.',
      'WITCH': 'Run the numbers calmly. If they work, accept.',
      'GLINT': 'Go if it moves me forward. I owe this place my notice, nothing more.',
      'DUNE': "Say yes. I'll make it work somehow.",
      'INK': "If the work does some good, yes. I'll manage on less.",
      'YORE': "Go. I'd turn it into something far bigger than they planned.",
      'WUBRG': 'At twenty-five, yes. At fifty with a mortgage, probably not.'
    }
  },
  MISTAKE: {
    id: 'MISTAKE',
    context: "You've made a serious mistake, and it has cost time and money.",
    responses: {
      'MONO-W': "Give up my evenings until it's put right for everyone it affected.",
      'MONO-U': 'Trace exactly how it happened before anyone touches it.',
      'MONO-B': 'Take charge of the clean-up myself.',
      'MONO-R': 'Put my hand up straight away and start fixing it.',
      'MONO-G': 'Put it right, then let it go.',
      'AZORIUS': 'Report it in writing, through the usual channels.',
      'DIMIR': 'Work out exactly what went wrong before anyone else does.',
      'RAKDOS': 'Own up, then go after something bigger.',
      'GRUUL': 'Roll my sleeves up and fix it the way I know works.',
      'SELESNYA': 'Tell the group at once, and ask for their help.',
      'ORZHOV': 'Cover the cost myself, so nobody can hold it over me.',
      'IZZET': 'Use what it taught me to build a better fix.',
      'GOLGARI': 'Build the next attempt on the parts that can be saved.',
      'BOROS': 'Make it right with the people who lost out, before anything else.',
      'SIMIC': 'Change how I work, bit by bit, until it fits better.',
      'BANT': 'Shield everyone else from the fallout first, then fix it in order.',
      'ESPER': 'Tell the whole story myself, with the numbers, before the rumours do.',
      'GRIXIS': 'Turn the fix into my next pitch.',
      'JUND': 'Take the hit and keep going.',
      'NAYA': "I'd feel awful, and I'd put all of that into fixing it.",
      'ABZAN': 'Take the telling-off. My record will carry me through it.',
      'JESKAI': "Drill the step where my method slipped until it can't.",
      'SULTAI': "If it can't be saved, cut my losses early.",
      'MARDU': 'Say who fixes what. We fix it tonight.',
      'TEMUR': 'Treat it as a sign the whole approach needs changing.',
      'WITCH': 'Put a figure on the damage before deciding anything.',
      'GLINT': 'Recover the money by the quickest route going.',
      'DUNE': "Get stuck into fixing it with anyone who's free.",
      'INK': "I'd work for nothing until the people it hurt are back on their feet.",
      'YORE': 'Automate that step, so nobody can make the same slip by hand.',
      'WUBRG': 'Size it up, then decide if it needs an apology or a new system.'
    }
  },
  BURNOUT: {
    id: 'BURNOUT',
    context: "You're exhausted, and there's more on your plate than you can carry.",
    responses: {
      'MONO-W': 'Finish my share first. Then ask for a fairer split next time.',
      'MONO-U': "Work out exactly where the time's going before changing anything.",
      'MONO-B': "Drop the work that doesn't get me anywhere.",
      'MONO-R': "Tell them all I'm at breaking point.",
      'MONO-G': 'A week of early nights first.',
      'AZORIUS': 'Put in a formal request for help.',
      'DIMIR': 'Have a private word with the person who sets my deadlines.',
      'RAKDOS': 'Switch my phone off for a long weekend.',
      'GRUUL': 'Cancel the meetings and just do the work.',
      'SELESNYA': "Admit I'm drowning, in front of everyone, and ask for help.",
      'ORZHOV': "Call in a few favours I'm owed.",
      'IZZET': 'Experiment with a different way of working each day.',
      'GOLGARI': 'Let some of it quietly lapse, and see what anyone misses.',
      'BOROS': 'Finish this for the people counting on me, then rest.',
      'SIMIC': 'Change one habit a week, and keep the ones that help.',
      'BANT': 'Cut the list to a load I could keep up for a year.',
      'ESPER': "Hand off everything I don't need to decide myself.",
      'GRIXIS': 'Give the routine work away and keep the work that wins.',
      'JUND': "Keep going. I've always outlasted people when it gets like this.",
      'NAYA': 'Get everyone out for a night. Their energy keeps me going.',
      'ABZAN': 'Pace myself, as I did the last time it got this bad.',
      'JESKAI': 'Strict hours, kept to the minute.',
      'SULTAI': 'Keep the work that will pay off next year, and pace the rest.',
      'MARDU': 'Drop everything but the most important job.',
      'TEMUR': "A few days away. I'd come back with a new plan.",
      'WITCH': 'Work out what can wait, and let it wait.',
      'GLINT': "Renegotiate everything I've agreed to, starting with the biggest.",
      'DUNE': 'Stop thinking about it. A hard run, then straight back in.',
      'INK': 'Only help the people who need me most, for now.',
      'YORE': 'Rebuild my whole week from scratch, around the work that matters.',
      'WUBRG': "Depends whether it's this month or this job. I'd find out first."
    }
  },
  BETRAYAL: {
    id: 'BETRAYAL',
    context: 'Someone you trusted has just passed off your idea as theirs, in front of people who matter to you.',
    responses: {
      'MONO-W': 'Push for a fair way of recording whose ideas are whose.',
      'MONO-U': 'First work out why they did it.',
      'MONO-B': 'Make sure everyone who matters knows it was mine by tonight.',
      'MONO-R': 'Call it out there and then, in front of everyone.',
      'MONO-G': "Let it go. It'll come out in time.",
      'AZORIUS': 'Ask for a fair hearing, with both of us there.',
      'DIMIR': 'Say nothing, and quietly let the right people see my earlier drafts.',
      'RAKDOS': 'Interrupt with a better idea, on the spot.',
      'GRUUL': "Say 'That was mine,' and get back to work.",
      'SELESNYA': 'Have a quiet word over coffee, and keep the friendship.',
      'ORZHOV': 'Let it pass, on the understanding they back my next proposal.',
      'IZZET': 'Build a working version of it before they can.',
      'GOLGARI': 'Let them run with it, and pick up the pieces they drop.',
      'BOROS': "If they'll do it to me, they've done it to others. I'll find out.",
      'SIMIC': 'Trust them a little less from now on.',
      'BANT': 'Wait a week, then raise it with them privately.',
      'ESPER': 'Put the dated original in front of whoever decides.',
      'GRIXIS': "Pitch a bigger idea to the same people before the week's out.",
      'JUND': 'Beat them on the next one, in public.',
      'NAYA': 'Tell the whole team how it felt, and ask them to back me.',
      'ABZAN': 'Leave it to my record. People here know my work.',
      'JESKAI': 'Do the next one so well that nobody could mistake whose it is.',
      'SULTAI': 'Never share an idea with them again.',
      'MARDU': 'Take it to the person in charge, and settle it before it festers.',
      'TEMUR': 'Next time, present it myself, first.',
      'WITCH': "Work out what the credit's worth. If it's not much, let it go.",
      'GLINT': 'From now on my ideas go straight to the top, with my name on.',
      'DUNE': 'Take them aside afterwards and say I know.',
      'INK': "Maybe they forgot. I'll give them a chance to put it right.",
      'YORE': "Let them have it. I'm already working on what replaces it.",
      'WUBRG': "With a friend, I'd talk it over. With a rival, I'd show my proof."
    }
  },
  ETHICS: {
    id: 'ETHICS',
    context: "You find out your employer is doing something legal but dodgy. It's profitable, and your bonus depends on it.",
    responses: {
      'MONO-W': 'Refuse the bonus, and raise it in writing with the people in charge.',
      'MONO-U': "Read everything first. I want to know exactly what's at stake.",
      'MONO-B': 'Offer to fix it, in return for running that part of the business.',
      'MONO-R': "It feels wrong, so I'd say so, whatever it costs me.",
      'MONO-G': 'Keep my own work honest, and let the rest take its course.',
      'AZORIUS': "Propose a change to the rules so it can't happen again.",
      'DIMIR': 'Keep a careful record of it, in case I need it.',
      'RAKDOS': "Tell the boss to their face that it's dodgy, and see what happens.",
      'GRUUL': 'Refuse to do my part of it.',
      'SELESNYA': "Stand with the people it's hurting.",
      'ORZHOV': 'Leave it to the people above me, after a private word.',
      'IZZET': 'Run a small, clean version alongside it, and show them the results.',
      'GOLGARI': "Expect it to collapse, and be ready to rebuild from what's left.",
      'BOROS': 'Fight it, in public if I must.',
      'SIMIC': "Change it from the inside, one practice at a time, until it's clean.",
      'BANT': 'Push for a full review, however long it takes.',
      'ESPER': 'If the risk outweighs the profit, stop it.',
      'GRIXIS': 'Raise it with the board before my boss can bury it.',
      'JUND': "Make sure I'm the last one they'd ever let go.",
      'NAYA': 'Get everyone together and make enough noise that it stops.',
      'ABZAN': "Stop it now, before it costs us customers we've had for decades.",
      'JESKAI': 'Do my own part by the book, and argue for change at every meeting.',
      'SULTAI': 'Learn the trade inside out, then set up a clean rival of my own.',
      'MARDU': 'Demand a decision from the top by Friday.',
      'TEMUR': "Move to the parts of the business that don't depend on it.",
      'WITCH': "Get a lawyer's view quietly before doing anything.",
      'GLINT': 'Line up my next move before it breaks.',
      'DUNE': 'Hand my notice in tomorrow.',
      'INK': "Warn the customers it's hurting.",
      'YORE': 'Propose a new product line that makes the dodgy one pointless.',
      'WUBRG': "How hard I push depends on who it hurts. I'd find that out first."
    }
  },
  MTG_STALL: {
    id: 'MTG_STALL',
    context: "It's the final game of your store's Commander league, with the title at stake. After 40 minutes, nobody will attack.",
    responses: {
      'MONO-W': 'Protect the player with the smallest board.',
      'MONO-U': 'Hold my answers and wait for someone else to move first.',
      'MONO-B': 'Make quiet deals with the two weakest players.',
      'MONO-R': "Attack now. I can't sit here another ten minutes.",
      'MONO-G': 'Wait. My deck gets stronger the longer this goes.',
      'AZORIUS': 'Propose an open deal with clear terms, and keep to it.',
      'DIMIR': "Keep passing, and let them guess what I'm holding.",
      'RAKDOS': 'Swing at the biggest threat with everything I have.',
      'GRUUL': 'Attack with my biggest creature. Keep it simple.',
      'SELESNYA': 'Build up alongside the friendliest player.',
      'ORZHOV': "Offer protection to anyone who'll back me later.",
      'IZZET': 'Cast something odd that changes the board, and see who reacts.',
      'GOLGARI': 'Let my creatures trade off, then bring them back from the graveyard.',
      'BOROS': 'Attack the leader, and call on the others to join me.',
      'SIMIC': 'Grow my creatures a little every turn.',
      'BANT': 'Hold back, then join in when the table turns on the leader.',
      'ESPER': 'Keep everyone calm with small deals until my win is ready.',
      'GRIXIS': "Get the others fighting each other, then finish whoever's left.",
      'JUND': 'Make every combat cost them more than it costs me.',
      'NAYA': 'Get the table laughing, then lead the charge.',
      'ABZAN': 'Sit tight behind my defences, gaining life every turn.',
      'JESKAI': 'Play towards the exact turn I can win.',
      'SULTAI': 'Pick off whoever overcommits first.',
      'MARDU': 'Go all in on one huge attack, whatever I lose.',
      'TEMUR': 'Hold up mana, and flash in a big threat at the end of a turn.',
      'YORE': 'Assemble my artifact combo and win in one turn.',
      'GLINT': 'Switch sides whenever the board changes.',
      'DUNE': 'Attack before the slower decks find their answers.',
      'INK': 'Give everyone something to get the game moving, even if it costs me.',
      'WITCH': 'Draw no attention while they use up their answers.',
      'WUBRG': "Read the table, then play whatever role it's missing."
    }
  }
};

// COMMANDER_ORACLE
const COMMANDER_ORACLE = {
  // MONO-COLOR
  'Elesh Norn, Grand Cenobite': {
    cost: '{5}{W}{W}',
    pt: '4/7',
    text: ['Vigilance', 'Other creatures you control get +2/+2.', 'Creatures your opponents control get -2/-2.']
  },
  'Urza, Lord High Artificer': {
    cost: '{2}{U}{U}',
    pt: '1/4',
    text: ['When Urza enters, create a 0/0 colorless Construct artifact creature token with "This creature gets +1/+1 for each artifact you control."', 'Tap an untapped artifact you control: Add {U}.', '{5}: Shuffle your library, then exile the top card. Until end of turn, you may play that card without paying its mana cost.']
  },
  "K'rrik, Son of Yawgmoth": {
    cost: '{4}{B/P}{B/P}{B/P}',
    pt: '2/2',
    text: ['({B/P} can be paid with either {B} or 2 life.)', 'Lifelink', 'For each {B} in a cost, you may pay 2 life rather than pay that mana.', 'Whenever you cast a black spell, put a +1/+1 counter on K\'rrik.']
  },
  'Krenko, Mob Boss': {
    cost: '{2}{R}{R}',
    pt: '3/3',
    text: ['{T}: Create X 1/1 red Goblin creature tokens, where X is the number of Goblins you control.']
  },
  'Omnath, Locus of Mana': {
    cost: '{2}{G}',
    pt: '1/1',
    text: ['You don\'t lose unspent green mana as steps and phases end.', 'Omnath gets +1/+1 for each unspent green mana you have.']
  },
  
  // TWO-COLOR GUILDS
  'Grand Arbiter Augustin IV': {
    cost: '{2}{W}{U}',
    pt: '2/3',
    text: ['White spells you cast cost {1} less to cast.', 'Blue spells you cast cost {1} less to cast.', 'Spells your opponents cast cost {1} more to cast.']
  },
  'Obzedat, Ghost Council': {
    cost: '{1}{W}{W}{B}{B}',
    pt: '5/5',
    text: ['When Obzedat enters, target opponent loses 2 life and you gain 2 life.', 'At the beginning of your end step, you may exile Obzedat. If you do, return it to the battlefield under its owner\'s control at the beginning of your next upkeep. It gains haste.']
  },
  "Yuriko, the Tiger's Shadow": {
    cost: '{1}{U}{B}',
    pt: '1/3',
    text: ['Commander ninjutsu {U}{B} ({U}{B}, Return an unblocked attacker you control to hand: Put this card onto the battlefield from your hand or the command zone tapped and attacking.)', 'Whenever a Ninja you control deals combat damage to a player, reveal the top card of your library and put that card into your hand. Each opponent loses life equal to that card\'s mana value.']
  },
  'Niv-Mizzet, Parun': {
    cost: '{U}{U}{U}{R}{R}{R}',
    pt: '5/5',
    text: ['This spell can\'t be countered.', 'Flying', 'Whenever you draw a card, Niv-Mizzet deals 1 damage to any target.', 'Whenever a player casts an instant or sorcery spell, you draw a card.']
  },
  'Borborygmos Enraged': {
    cost: '{4}{R}{R}{G}{G}',
    pt: '7/6',
    text: ['Trample', 'Whenever Borborygmos Enraged deals combat damage to a player, reveal the top three cards of your library. Put all land cards revealed this way into your hand and the rest into your graveyard.', 'Discard a land card: Borborygmos Enraged deals 3 damage to any target.']
  },
  'Rakdos, Lord of Riots': {
    cost: '{B}{B}{R}{R}',
    pt: '6/6',
    text: ['You can\'t cast this spell unless an opponent lost life this turn.', 'Flying, trample', 'Creature spells you cast cost {1} less to cast for each 1 life your opponents have lost this turn.']
  },
  'Meren of Clan Nel Toth': {
    cost: '{2}{B}{G}',
    pt: '3/4',
    text: ['Whenever another creature you control dies, you get an experience counter.', 'At the beginning of your end step, choose target creature card in your graveyard. If that card\'s mana value is less than or equal to the number of experience counters you have, return it to the battlefield. Otherwise, put it into your hand.']
  },
  'Prime Speaker Vannifar': {
    cost: '{2}{G}{U}',
    pt: '2/4',
    text: ['{T}, Sacrifice another creature: Search your library for a creature card with mana value equal to 1 plus the sacrificed creature\'s mana value, put that card onto the battlefield, then shuffle. Activate only as a sorcery.']
  },
  'Aurelia, the Warleader': {
    cost: '{2}{R}{R}{W}{W}',
    pt: '3/4',
    text: ['Flying, vigilance, haste', 'Whenever Aurelia attacks for the first time each turn, untap all creatures you control. After this phase, there is an additional combat phase.']
  },
  "Trostani, Selesnya's Voice": {
    cost: '{G}{G}{W}{W}',
    pt: '2/5',
    text: ['Whenever another creature enters the battlefield under your control, you gain life equal to its toughness.', '{1}{G}{W}, {T}: Populate (Create a token that\'s a copy of a creature token you control.)']
  },
  
  // THREE-COLOR
  'Rafiq of the Many': {
    cost: '{1}{G}{W}{U}',
    pt: '3/3',
    text: ['Exalted (Whenever a creature you control attacks alone, that creature gets +1/+1 until end of turn.)', 'Whenever a creature you control attacks alone, it gains double strike until end of turn.']
  },
  'Sharuum the Hegemon': {
    cost: '{3}{W}{U}{B}',
    pt: '5/5',
    text: ['Flying', 'When Sharuum the Hegemon enters, you may return target artifact card from your graveyard to the battlefield.']
  },
  'Nekusar, the Mindrazer': {
    cost: '{2}{U}{B}{R}',
    pt: '2/4',
    text: ['At the beginning of each player\'s draw step, that player draws an additional card.', 'Whenever an opponent draws a card, Nekusar deals 1 damage to that player.']
  },
  'Prossh, Skyraider of Kher': {
    cost: '{3}{B}{R}{G}',
    pt: '5/5',
    text: ['When you cast this spell, create X 0/1 red Kobold creature tokens named Kobolds of Kher Keep, where X is the amount of mana spent to cast it.', 'Flying', 'Sacrifice another creature: Prossh gets +1/+0 until end of turn.']
  },
  'Samut, Voice of Dissent': {
    cost: '{3}{R}{G}',
    pt: '3/4',
    text: ['Flash', 'Double strike, vigilance, haste', 'Other creatures you control have haste.', '{W}, {T}: Untap another target creature.']
  },
  'Karador, Ghost Chieftain': {
    cost: '{5}{W}{B}{G}',
    pt: '3/4',
    text: ['Karador, Ghost Chieftain costs {1} less to cast for each creature card in your graveyard.', 'During each of your turns, you may cast one creature spell from your graveyard.']
  },
  'Narset, Enlightened Master': {
    cost: '{3}{U}{R}{W}',
    pt: '3/2',
    text: ['First strike, hexproof', 'Whenever Narset attacks, exile the top four cards of your library. Until end of turn, you may cast noncreature spells from among those cards without paying their mana costs.']
  },
  'Sidisi, Brood Tyrant': {
    cost: '{1}{B}{G}{U}',
    pt: '3/3',
    text: ['Whenever Sidisi enters or attacks, mill three cards.', 'Whenever one or more creature cards are put into your graveyard from your library, create a 2/2 black Zombie creature token.']
  },
  'Alesha, Who Smiles at Death': {
    cost: '{2}{R}',
    pt: '3/2',
    text: ['First strike', 'Whenever Alesha, Who Smiles at Death attacks, you may pay {W/B}{W/B}. If you do, return target creature card with power 2 or less from your graveyard to the battlefield tapped and attacking.']
  },
  'Surrak Dragonclaw': {
    cost: '{2}{G}{U}{R}',
    pt: '6/6',
    text: ['Flash', 'This spell can\'t be countered.', 'Creature spells you control can\'t be countered.', 'Other creatures you control have trample.']
  },
  
  // FOUR-COLOR
  "Atraxa, Praetors' Voice": {
    cost: '{G}{W}{U}{B}',
    pt: '4/4',
    text: ['Flying', 'Vigilance', 'Deathtouch', 'Lifelink', 'At the beginning of your end step, proliferate. (Choose any number of permanents and/or players, then give each another counter of each kind already there.)']
  },
  'Breya, Etherium Shaper': {
    cost: '{W}{U}{B}{R}',
    pt: '4/4',
    text: ['When Breya enters, create two 1/1 blue Thopter artifact creature tokens with flying.', '{2}, Sacrifice two artifacts: Choose one —', '• Breya deals 3 damage to target player or planeswalker.', '• Target creature gets -4/-4 until end of turn.', '• You gain 5 life.']
  },
  'Yidris, Maelstrom Wielder': {
    cost: '{U}{B}{R}{G}',
    pt: '5/4',
    text: ['Trample', 'Whenever Yidris deals combat damage to a player, as you cast spells from your hand this turn, they gain cascade.']
  },
  'Saskia the Unyielding': {
    cost: '{B}{R}{G}{W}',
    pt: '3/4',
    text: ['Vigilance, haste', 'As Saskia enters, choose a player.', 'Whenever a creature you control deals combat damage to a player, it deals that much damage to the chosen player.']
  },
  'Kynaios and Tiro of Meletis': {
    cost: '{R}{G}{W}{U}',
    pt: '2/8',
    text: ['At the beginning of your end step, draw a card.', 'Each player may put a land card from their hand onto the battlefield, then each opponent who didn\'t draws a card.']
  },
  
  // FIVE-COLOR
  'Kenrith, the Returned King': {
    cost: '{4}{W}',
    pt: '5/5',
    text: ['{R}: All creatures gain trample and haste until end of turn.', '{1}{G}: Put a +1/+1 counter on target creature.', '{2}{W}: Target player gains 5 life.', '{3}{U}: Target player draws a card.', '{4}{B}: Put target creature card from a graveyard onto the battlefield under its owner\'s control.']
  }
};

// PROFILES
const PROFILES = {
  'MONO-W':{
    name:'MONO-WHITE',
    tag:'Peace Through Structure',
    colors:['W'],
    philosophy:"You believe the group matters more than any one person, including you. Rules protect the people who can't argue for themselves, so you keep them even when it costs you.",
    desc:"You make sure the rules apply to everyone and outlast whoever wrote them. If someone is getting special treatment, you notice and say so.",
    pubBanter:"You've been asked to stop quoting the dress code by paragraph number.",
    cmd:'Elesh Norn, Grand Cenobite',
    cmdDesc:'Your other creatures get +2/+2, and your opponents\' creatures get -2/-2.',
    str:["Will hold a team together past the point most people would have given up.","Has turned down a promotion that came with a favour attached.","Gets asked by new starters, because they'll get the same answer as everyone else.","Makes decisions in the open, where they can't be called a stitch-up."],
    weak:["Will enforce a rule for years after the reason for it has gone.","Looks for the perfectly fair answer in situations that don't have one.","Is caught out, every time, by the colleague who thinks the rules are for other people.","Notices the world has changed some time after it did."],
    roles:'HR Leadership, Compliance, Audit, Ethics, Community Management'
  },
  'MONO-U':{
    name:'MONO-BLUE',
    tag:'Perfection Through Knowledge',
    colors:['U'],
    philosophy:"You believe most decisions get better with more information. Before you commit, you want every question that matters asked and answered, so you're often the last to decide.",
    desc:"You're the person who reads the documentation, then re-reads the bit everyone else skipped. In meetings, the loud people often end up asking you for the answer.",
    pubBanter:"You once answered 'any questions?' with a numbered list.",
    cmd:'Urza, Lord High Artificer',
    cmdDesc:'Urza lets you tap your artifacts for blue mana. For five mana, you shuffle your library and exile the top card, which you may play free until end of turn.',
    str:["Reads the footnotes in the appendix.","Finds the assumption nobody questioned and questions it, gently.","Builds the model the rest of the team ends up borrowing.","Updates their position when the evidence updates, without making a thing of it."],
    weak:["Will spend a week optimising the decision that needed an afternoon.","Mistakes 'I can see how you might feel that' for an adequate emotional response.","Considers fifteen edge cases before lunch and has not yet addressed the main one.","Marks other people's arguments out of ten, without being asked."],
    roles:'Strategy, Research, Analytics, Architecture, Policy Analysis, Forecasting'
  },
  'MONO-B':{
    name:'MONO-BLACK',
    tag:'Ambition Without Apology',
    colors:['B'],
    philosophy:"You believe everyone should be acting in their own interest. Power is what lets you change what happens around you, so you go after it openly.",
    desc:"People around you are often still catching up with a situation you've already read and acted on.",
    pubBanter:"",
    cmd:"K'rrik, Son of Yawgmoth",
    cmdDesc:'K\'rrik lets you pay 2 life instead of black mana, and lifelink heals some of it back.',
    str:["Asks for the pay rise the week they've earned it.","Knows what each person in a negotiation needs to walk away with.","Makes the unpopular call on a Friday afternoon and sleeps fine that night."],
    weak:["Is thrown by colleagues who aren't keeping score.","Trades away a colleague's project to win a bigger argument, and is surprised when they take it personally.","Finds it hard to believe a compliment comes with nothing attached."],
    roles:'Executive Leadership, M&A, Private Equity, Turnarounds, Restructuring, Corporate Strategy'
  },
  'MONO-R':{
    name:'MONO-RED',
    tag:'Freedom Through Action',
    colors:['R'],
    philosophy:"You believe life is too short for hesitation. When something feels right you act on it now and sort out the details later.",
    desc:"Your gut is sometimes wrong, but acting on it fast usually makes up for that.",
    pubBanter:"You've replied to the email before the attachment finished downloading.",
    cmd:'Krenko, Mob Boss',
    cmdDesc:'Krenko taps to make a 1/1 Goblin for every Goblin you already control.',
    str:["Turns 'someone should do something' into doing it.","Says what they think straight away, before they've had time to soften it.","Can talk a tired team into one more go."],
    weak:["Reads three sentences of the brief and assumes the rest.","Has restarted a slow project from scratch because waiting was boring.","Runs at full output for six weeks, then is unreachable for a fortnight."],
    roles:'Startups, Sales, Crisis Response, Creative Industries, Frontline Operations, Live Events'
  },
  'MONO-G':{
    name:'MONO-GREEN',
    tag:'Growth Through Acceptance',
    colors:['G'],
    philosophy:"You believe nature got it right the first time. Things that have worked for years usually keep working, so you leave them alone until they stop.",
    desc:"You trust proven patterns. Updating one takes you a while, but you'll do it when you have to.",
    pubBanter:"",
    cmd:'Omnath, Locus of Mana',
    cmdDesc:"Omnath doesn't lose green mana as steps and phases end, and grows +1/+1 for each unspent green mana you have.",
    str:["Has been with the company nine years and remembers, without checking, why that policy exists.","Knows the difference between a thing that is broken and a thing that is healing, and will let the second one finish.","Builds processes the way other people build sheds, for weather they have personally seen."],
    weak:["Has politely outlasted three reorgs and the people who proposed them.","Treats every new suggestion as an interesting thing happening to other people.","Will let a problem deepen on the theory that it might resolve itself."],
    roles:"Farming, Conservation, Facilities, Estate Management, Mentoring"
  },
  'AZORIUS':{
    name:'AZORIUS',
    tag:'Order Through Knowledge',
    colors:['W','U'],
    philosophy:"You believe good outcomes come from fair rules, applied carefully and consistently. You don't mind decisions taking longer if they're made properly.",
    desc:"You build the process and make sure it applies to everyone equally. Written down properly, it keeps working after you've moved on.",
    pubBanter:"",
    cmd:'Grand Arbiter Augustin IV',
    cmdDesc:"Your white and blue spells cost one mana less, and your opponents' spells cost one mana more.",
    str:["Designs the process that stops last year's disaster from happening again.","Documents the decision and the dissent.","Builds systems where the wrong answer is hard to reach, even on purpose."],
    weak:["Can't start a piece of work until it has a reference number.","Will apply the letter of a rule in an emergency it was never written for.","Confuses 'the rule has been followed' with 'the problem has been solved'."],
    roles:'COO, Compliance, Strategic Planning, Governance, General Counsel, Risk Management'
  },
  'SELESNYA':{
    name:'SELESNYA',
    tag:'Together, Slowly',
    colors:['W','G'],
    philosophy:"You believe people do their best work among people they know and trust. Communities, like trees, take a long time to grow and longer to repair, so you'll go slowly if it keeps a team together.",
    desc:"You notice who is struggling before they say anything.",
    pubBanter:"You organised a leaving do for someone who was only going on holiday.",
    cmd:"Trostani, Selesnya's Voice",
    cmdDesc:"You gain life equal to the toughness of each other creature that enters under your control. For three mana, one of them green and one white, Trostani taps to copy a creature token you control.",
    str:["Remembers the names of everyone's children and which one is having a hard year, and acts on it.","Builds a team that, three years in, still likes each other.","Finds the version of the plan that nobody has to lose for it to work."],
    weak:["Has been rehearsing the same difficult conversation in their head since spring.","Keeps a struggling colleague in a job they can't do, because letting them go feels cruel.","Waits for hard decisions to become gentle ones."],
    roles:'Chief People Officer, HR, Team Leads, Community Programmes, Volunteer Coordination'
  },
  'ORZHOV':{
    name:'ORZHOV',
    tag:'Rules That Pay',
    colors:['W','B'],
    philosophy:"You believe a clear hierarchy keeps an organisation in order. The people who build and run it should do well out of it, and you plan to be one of them.",
    desc:"You have a rule-builder's patience and a player's eye for advantage. The hierarchies you build serve the organisation and serve you, and you see no conflict between the two.",
    pubBanter:"Your expense claims are immaculate. So is your memory of everyone else's.",
    cmd:'Obzedat, Ghost Council',
    cmdDesc:'When Obzedat enters, an opponent loses 2 life and you gain 2. It can leave at your end step and return at your next upkeep with haste.',
    str:["Writes rules that get followed without anyone being chased.","Designs the hierarchy where the right people advance and the merely loud ones politely stall.","Holds the institutional memory, including the parts the institution has been trying to forget.","Can find the budget, and knows who to talk to if there isn't one."],
    weak:["Still mentions the small favour they did a colleague years ago.","Promotes the deserving and the indebted, and people aren't sure which they are.","Applies the policy in full to other teams, and with some discretion to their own."],
    roles:"COO, Finance, Law, Private Banking, Estate Planning, Senior Management, Institutional Investing"
  },
  'DIMIR':{
    name:'DIMIR',
    tag:'Knowing More Than You Say',
    colors:['U','B'],
    philosophy:"You believe the person who knows the most usually gets their way. Most of what you know comes from noticing what people leave out, and you keep it to yourself until it's useful.",
    desc:"Most of the time you know what everyone around you is after, but you rarely let on.",
    pubBanter:"You know who's leaving before their manager does.",
    cmd:"Yuriko, the Tiger's Shadow",
    cmdDesc:'Yuriko swaps in for an unblocked attacker. When your Ninjas hit a player, you reveal your top card and put it in your hand. Each opponent loses life equal to its mana value.',
    str:["Has spotted three of the last five problems first.","Can tell from a seating plan who has fallen out with whom.","Adapts faster when the rules change, because they were watching for that already."],
    weak:["Gathers information faster than they can turn it into results.","Has been told they're hard to read, and took it as a compliment.","Finds it hard to be trusted quickly, because nobody has ever seen their whole hand.","Carries everyone's secrets and pretends it isn't exhausting."],
    roles:'Strategic Planning, M&A, Competitive Intelligence, VC/PE, Investigative Journalism'
  },
  'IZZET':{
    name:'IZZET',
    tag:'Discovery Through Experimentation',
    colors:['U','R'],
    philosophy:"You believe understanding comes through trying. When an idea arrives you build a rough prototype that week. Most of what you know came from the prototypes that failed.",
    desc:"You're curious about how things work and impatient to test your ideas on something real.",
    pubBanter:"You tested it on the live system again and called the outage 'interesting data'.",
    cmd:'Niv-Mizzet, Parun',
    cmdDesc:'Can\'t be countered. Whenever you draw a card, deal 1 damage to any target. Whenever a player casts an instant or sorcery spell, you draw a card.',
    str:["Will try the thing that probably won't work, on the chance it does.","Leaves a twenty-minute meeting with four ideas worth testing.","Will rebuild a system at 11pm because they thought of a better way at 10:47pm.","Knows the spec well enough to find the bit where the spec is lying."],
    weak:["Has three projects on the go. One of them is on fire.","Loses interest exactly when the idea has to become a thing anyone else can use.","Keeps the documentation in their head.","Underestimates how much other people value something that works, however badly.","Will solve the wrong problem brilliantly."],
    roles:'R&D, Product Development, Startups, Quant Research'
  },
  'GRUUL':{
    name:'GRUUL',
    tag:'Power Through Instinct',
    colors:['R','G'],
    philosophy:"You believe most modern work is more complicated than it needs to be. The fancy new approach is usually the old one with extra steps. So you trust your gut and use what has already worked.",
    desc:"When a plan stops working, you're the one the team sends in. You fix it with methods you already trust, often before anyone has agreed a new plan.",
    pubBanter:"You've never read a manual. The flat-pack wardrobe is somehow still standing.",
    cmd:'Borborygmos Enraged',
    cmdDesc:'Whenever Borborygmos deals combat damage to a player, reveal the top three cards: lands go to your hand, the rest to your graveyard. Discard a land card: 3 damage to any target.',
    str:["Calls for a decision when the discussion starts going round in circles.","Will not pretend the meeting was useful when it wasn't.","Knows when the answer is 'just do it' and is correct more often than is comfortable.","Does the job and is gone before the thank-you email goes round."],
    weak:["Has called a fire drill 'process for the sake of process'.","Treats nuance as someone else's job, which works until they're on their own.","Deals with things quickly, and only sometimes well."],
    roles:"Emergency Services, Sport, Field Engineering, Sales, Operations"
  },
  'RAKDOS':{
    name:'RAKDOS',
    tag:'Freedom Through Chaos',
    colors:['B','R'],
    philosophy:"You believe most rules are there to stop people enjoying themselves. If you want something you go after it, and you take the consequences on the chin.",
    desc:"Nobody has to guess what you want, because you go after it openly. You also do what you say you'll do.",
    pubBanter:"You've been banned from organising the Christmas party, twice.",
    cmd:'Rakdos, Lord of Riots',
    cmdDesc:'You can cast Rakdos only after an opponent has lost life this turn. Your creature spells then cost one mana less for each life your opponents have lost this turn.',
    str:["Livens up a training day that was dying on its feet.","Will say what everyone was thinking but nobody planned to say.","Can turn a disastrous launch into a story people want to hear.","Treats company-line phrases with suspicion."],
    weak:["Has been described as 'lots of fun' and 'the reason two people left' in the same review.","Will undermine an institution they need, on principle, then be surprised it's gone.","Makes jokes at moments that needed someone to be serious."],
    roles:'Entertainment, Live Music, Nightlife, Activism, Creative Direction'
  },
  'GOLGARI':{
    name:'GOLGARI',
    tag:'Growth Through Decay',
    colors:['B','G'],
    philosophy:"You believe nothing is wasted. Endings and failures are part of how things grow. Letting something die when its time has come doesn't trouble you.",
    desc:"You're patient and clear about your own interests. When a project dies, you keep whatever is still useful from it. People come to you after a failure, or when they want to understand the long game.",
    pubBanter:"",
    cmd:'Meren of Clan Nel Toth',
    cmdDesc:"Each time another of your creatures dies, you get an experience counter. At your end step, you choose a creature card in your graveyard. It returns to the battlefield if its mana value is no more than your experience counters, and to your hand if not.",
    str:["Can tell a project is dying months before the people running it can.","Will keep failing initiatives on life support exactly long enough to harvest the useful bits.","Has seen this crisis before and knows roughly when it ends."],
    weak:["Lets a sinking plan run its course, even when a word in the right ear might have saved it.","Has a folder labelled 'might be useful in three years' that contains everything from the last five years.","Offers 'something new will grow out of this' where a plan should be."],
    roles:"Conservation, Turnarounds, Archives, Insolvency Practice"
  },
  'SIMIC':{
    name:'SIMIC',
    tag:'Evolution Through Design',
    colors:['G','U'],
    philosophy:"You believe almost anything can be improved the way nature improves things, one small, careful change at a time.",
    desc:"You improve things a little at a time, and on purpose.",
    pubBanter:"You've been improving the coffee rota for two years, and it is now the best coffee rota in the building.",
    cmd:'Prime Speaker Vannifar',
    cmdDesc:'Tap Vannifar and sacrifice another creature: search for a creature with mana value exactly 1 more, and put it onto the battlefield.',
    str:["Builds the version they wanted, two iterations after the version everyone settled for.","Spots the one small change that will save the team an hour a week.","Reworks an inherited process a little every month until the original is forgotten."],
    weak:["Won't ship anything that is one paragraph short in its documentation.","Polishes parts that were never the bottleneck.","Holds the team to a standard nobody else can see."],
    roles:'Product Management, Process Improvement, Biotech, UX Research, Platform Engineering'
  },
  'BOROS':{
    name:'BOROS',
    tag:'Justice Through Action',
    colors:['R','W'],
    philosophy:"You believe that when something is wrong someone should step in, and it may as well be you. You act straight away and give it everything you have.",
    desc:"A loyal team usually follows you, because you're quick to act on what you believe.",
    pubBanter:"You've used the phrase 'hill to die on' about the stationery order.",
    cmd:'Aurelia, the Warleader',
    cmdDesc:'Whenever Aurelia attacks for the first time each turn, untap all your creatures and gain an additional combat phase.',
    str:["Can get a whole team angry about the right thing.","Says 'that's not fair' to the face of the person responsible.","Gets the first phone call when something has gone badly wrong."],
    weak:["Treats 'let's just send an email' as a form of moral cowardice.","Hears a polite request for more detail as the start of a fight.","Sorts new colleagues into allies and obstacles by the end of their first week."],
    roles:"Campaigning, Trade Unions, Law Enforcement, Crisis Management, Military"
  },
  'BANT':{
    name:'BANT',
    tag:'Harmony Through Structure',
    colors:['W','U','G'],
    philosophy:"You believe most disagreements end well if people take the time to understand each other. You'll spend that time, even when others want a quick answer.",
    desc:"You run the meetings where everyone gets heard and the decision still holds five years later.",
    pubBanter:"You asked for everyone's views on the lunch order, including the people on holiday.",
    cmd:'Rafiq of the Many',
    cmdDesc:'Whenever a creature you control attacks alone, it gets +1/+1 (exalted) and double strike.',
    str:['Asks the quietest person in the room first, and changes the plan when they\'re right.','Keeps the working behind every decision, so it still makes sense five years later.','Can tell a slow decision from a stuck one, and waits out the first.','Leaves a team in better shape than they found it, which takes about four years.'],
    weak:["Struggles when there's no time to consult anyone.","Takes 'everyone agreed' as proof that the plan is going to work.","Gives every disagreement one more meeting."],
    roles:'Executive Leadership in slow-growth sectors, Strategic HR, Educational Leadership, Policy Development, Mediation, Public Service'
  },
  'ESPER':{
    name:'ESPER',
    tag:'Perfection Through Control',
    colors:['W','U','B'],
    philosophy:"You believe a decision is only as good as the thinking behind it. Once you've done that thinking, you make the call yourself, whether or not people agree.",
    desc:"You're rarely the warmest person in the room. Your decisions are often still holding up after six months of pressure, and people learn to rely on them.",
    pubBanter:"Your out-of-office has an escalation path.",
    cmd:'Sharuum the Hegemon',
    cmdDesc:'When Sharuum enters, you may return an artifact card from your graveyard to the battlefield.',
    str:["Has read the whole budget, including the bits marked 'other'.","Sets things up so the right answer is also the easiest one to reach.","Knows which form to fill in, and which committee to skip.","Can say exactly what a decision will cost, and makes it anyway."],
    weak:["Finds the best answer on paper, and is the last to hear that the people it affects are upset.","Freezes when a crisis arrives before the information does.","Answers a heartfelt complaint with a revised procedure."],
    roles:"CFO/Finance, Chief Compliance Officer, Auditing, Actuarial Work, Intelligence Analysis, Public Policy"
  },
  'GRIXIS':{
    name:'GRIXIS',
    tag:"Power Through Pressure",
    colors:['U','B','R'],
    philosophy:"You believe whoever thinks fastest and pushes hardest usually gets the outcome they want. You can live with being unpopular for a while.",
    desc:"You read a situation faster than most and act on it straight away.",
    pubBanter:"",
    cmd:'Nekusar, the Mindrazer',
    cmdDesc:'Every player draws an extra card in their draw step, and whenever an opponent draws, Nekusar deals them 1 damage.',
    str:["Gets a lot done with very few people.","Is happy to name the cost out loud and to pay it.","Opens a negotiation already knowing the other side's lowest price."],
    weak:["Has used \"it's just business\" to describe something that was, by any honest reading, slightly personal.","Spends goodwill in the same week they earn it.","Replies to a complaint about their tone with the sales figures."],
    roles:'Turnaround CEO, Competitive Strategy, High-Stakes Trading, Private Equity'
  },
  'JUND':{
    name:'JUND',
    tag:'Survival Through Hunger',
    colors:['B','R','G'],
    philosophy:"You believe survival rewards the hungry and the adapted. You trust the instincts that got you this far. Whatever isn't working, you cut loose before it drags you down.",
    desc:"You're at your best when a competitor shows up and there's something to fight for.",
    pubBanter:"",
    cmd:'Prossh, Skyraider of Kher',
    cmdDesc:'When you cast Prossh, create X 0/1 Kobolds where X is the mana spent. Sacrifice another creature: Prossh gets +1/+0 until end of turn.',
    str:["Finishes the project everyone else was avoiding.",'Treats "this is hard" as a description and carries on.',"Will set a target nobody believes in, then hit it, partly out of spite.","Has been through two rounds of layoffs and is still here."],
    weak:["Has never played a friendly game of anything.","Built a pace the rest of the team can't hold, and can't see why.","Hears nuance as hesitation."],
    roles:'Sales, Startups, Professional Sport, Commodity Trading'
  },
  'NAYA':{
    name:'NAYA',
    tag:'Everybody In',
    colors:['R','G','W'],
    philosophy:"You believe a group of people who care about the same thing can do almost anything. For you, everything starts with a team that turns up. You've worked hard to build one, and you ask a lot of it.",
    desc:"People work harder on a plan you're behind, and believe in it more.",
    pubBanter:"",
    cmd:'Samut, Voice of Dissent',
    cmdDesc:"Samut has double strike and gives your other creatures haste. Tap Samut and pay one white mana to untap another creature, so it can act again.",
    str:["Can lift people who have stopped believing in their own project.","Knows everyone and has had drinks with everyone.","Is completely sincere, and other people's irony bounces off them."],
    weak:["Wants a group cheer at the end of a long call.","Assumes the fairest idea will win the argument on its own.","Is so enthusiastic that quieter colleagues can't get a word in."],
    roles:'Startups, Marketing, Politics, Sales, Event Planning, Community Building'
  },
  'ABZAN':{
    name:'ABZAN',
    tag:'Endurance Through Tradition',
    colors:['W','B','G'],
    philosophy:"You believe the things worth having take decades to build, and you're prepared to put in the decades. Anything that won't matter in ten years gets cut.",
    desc:"You build things to last, and you remember who helped and who didn't.",
    pubBanter:"You still call it 'the new building'. Nobody else in it remembers the old one.",
    cmd:'Karador, Ghost Chieftain',
    cmdDesc:'Karador costs one mana less for each creature card in your graveyard. Once during each of your turns, you may cast a creature from your graveyard.',
    str:["Has seen off four chief executives and one merger.","Knows which colleagues will still answer the phone in a bad year.","Keeps promises made by people who left years ago."],
    weak:["Has patiently explained why each new system won't work, and has been right twice and wrong four times.","Keeps a five-year-old pilot programme in pilot.","Can hold a grudge for longer than most people stay in a job."],
    roles:"Family Businesses, Local Government, Farming, Politics"
  },
  'JESKAI':{
    name:'JESKAI',
    tag:'Excellence Through Discipline',
    colors:['U','R','W'],
    philosophy:"You believe excellence is mostly practice. That means putting in long hours, which you consider a fair price for being good at something.",
    desc:"Years of practice have made you very good at several things. If someone asks how, you'll explain the method step by step.",
    pubBanter:"You brought a laminated agenda to the pub quiz.",
    cmd:'Narset, Enlightened Master',
    cmdDesc:'Whenever Narset attacks, exile the top four cards of your library. Until end of turn, you may cast the noncreature spells among them for free.',
    str:["Practises a presentation the way other people practise an instrument.","Fixes the ethical problem in a plan before it ships, without a fuss.","Notices when a skill has gone rusty, their own included."],
    weak:["Forgets the basics had to be learned, and starts beginners on the advanced version.","Will redo the work that was already correct because it could have been more correct.","Mentors well, but only people whose questions they find interesting."],
    roles:'Teaching, Coaching, Consulting, Classical Music, Martial Arts'
  },
  'SULTAI':{
    name:'SULTAI',
    tag:'The Long Game',
    colors:['B','G','U'],
    philosophy:"You believe the patient player usually wins. You get in early and let time do the work.",
    desc:"You keep a patient, careful record of who holds what.",
    pubBanter:"You've been waiting for the corner office since before it was built.",
    cmd:'Sidisi, Brood Tyrant',
    cmdDesc:'When Sidisi enters or attacks, mill 3. Whenever creature cards hit your graveyard from your library, create a 2/2 Zombie.',
    str:["Plays a two-year game in which nothing seems to happen for eighteen months.","Was already in the right meeting before anyone knew which meeting was going to be the right one.","Can sit through a long silence on the phone without filling it."],
    weak:["Needs to be in every conversation that matters, or have someone there.","Has let a good chance pass while waiting for a better one.","Plans so far ahead that colleagues stop asking what the plan is."],
    roles:'Property, Investment, Diplomacy, Wine Making, Corporate Development'
  },
  'MARDU':{
    name:'MARDU',
    tag:'Victory Through Sacrifice',
    colors:['R','W','B'],
    philosophy:"You believe decisive action within a clear hierarchy wins. You lead from the front and set a pace that not everyone can keep.",
    desc:"The team moves at your speed, and anyone who can't keep up gets left behind.",
    pubBanter:"",
    cmd:'Alesha, Who Smiles at Death',
    cmdDesc:"Whenever Alesha attacks, you may pay two mana, each white or black. If you do, a creature card with power 2 or less returns from your graveyard to the battlefield, tapped and attacking.",
    str:["Makes the call and doesn't reopen it a week later.","Knows who needs to be told what, and in which order.","Has hit deadlines that the client had already written off.","Is still holding the line when others are looking for a way out."],
    weak:["Reports the win and leaves out what it cost.","Only slows down between Christmas and the second of January.","Approves holiday requests in principle.","Looks round at the launch party and is briefly surprised by how few of the original team are left."],
    roles:'Turnarounds, Crisis Management, Sales, Founding Teams, Film Production'
  },
  'TEMUR':{
    name:'TEMUR',
    tag:'Whatever Works',
    colors:['G','U','R'],
    philosophy:"You believe each new problem probably needs a different approach from the last one. You drop an old method as soon as it stops fitting.",
    desc:"You change your approach as the situation shifts, usually sooner than the people around you.",
    pubBanter:"You went out for a sandwich and came back with a business idea and no sandwich.",
    cmd:'Surrak Dragonclaw',
    cmdDesc:"Neither Surrak nor your creatures can be countered, and your other creatures have trample.",
    str:["Learns a new tool in a weekend and teaches it on Monday.","Has a new idea most mornings. Some of them are good.","Stays calm when the plan falls apart, having expected it to.","Will try the thing nobody got permission to try."],
    weak:["Has been on the same project for six weeks and rewritten the foundations twice.","Is enrolled on four online courses and has finished one.","Has taught the team not to plan beyond the end of the month."],
    roles:"Startups, Research, Product Design, Journalism, Expedition Leading"
  },
  'WITCH':{
    name:'FOUR-COLOUR (No Red)',
    tag:'Perfection Without Haste',
    colors:['W','U','B','G'],
    philosophy:"You believe most problems are better solved slowly. You're happy to wait for the right answer, however strongly anyone feels about the wrong one.",
    desc:"You're the person whose plans are still working in three years. You take urgent requests calmly and decide whether they need any action at all.",
    pubBanter:"You asked whether your surprise party had come out of the contingency budget.",
    cmd:"Atraxa, Praetors' Voice",
    cmdDesc:'At your end step, proliferate: give each permanent and player you choose another of each kind of counter already on it.',
    str:["Wins long arguments by turning up to every meeting until the other side stops coming.","Is in year six of a ten-year plan.","Can take minutes during a shouting match, and get them right."],
    weak:["Has been called cold, mostly by people who were panicking at the time.",'Calls a passionate idea "inefficient" before finding out what the passion was for.',"Has more than once watched a crisis unfold and analysed it correctly without doing anything."],
    roles:'Operations, Finance, Strategy, Long-term Planning, Sovereign Wealth, Patient Capital'
  },
  'YORE':{
    name:'FOUR-COLOUR (No Green)',
    tag:"Innovation Without Nostalgia",
    colors:['W','U','B','R'],
    philosophy:"You believe whatever exists now is a first draft. You read up on how things used to be done, then build the next version with a team clever enough to argue with you.",
    desc:"You build complex systems and rebuild any part that doesn't quite fit, including parts that still work.",
    pubBanter:"You wrote a script to book a meeting room, and it now books all of them.",
    cmd:'Breya, Etherium Shaper',
    cmdDesc:"When Breya enters, you get two 1/1 flying Thopters. Pay two mana and sacrifice two artifacts, and Breya can deal 3 damage to a player or give you 5 life.",
    str:["Can hold a whole system in their head and change it while it's running.","Spots the one weak link in a design before it goes live.","Will work late because the work isn't right yet.","Automates any job they've had to do twice."],
    weak:["Turns the shopping list into a system.","Distrusts any solution short enough to fit on one slide.","Works at a pace their own body has started to complain about."],
    roles:'Tech Startups, Engineering Leadership, Systems Architecture, R&D, Founders'
  },
  'GLINT':{
    name:'FOUR-COLOUR (No White)',
    tag:'Power Without Permission',
    colors:['U','B','R','G'],
    philosophy:"You believe getting things done matters more than how it looks. When a rule only protects the person who made it, you work around it.",
    desc:"You have no strong loyalty to the group, so the lines other people stay inside don't hold you.",
    pubBanter:"",
    cmd:'Yidris, Maelstrom Wielder',
    cmdDesc:'When Yidris deals combat damage to a player, the spells you cast from your hand that turn gain cascade.',
    str:["Can work with anyone, including people the rest of the team won't speak to.","Gets the answer from the person who isn't supposed to give it.","Will tear down a system two people built their reputations on, once it stops working."],
    weak:["Treats \"is this okay?\" as a question for someone else's department.","Makes commitments in good faith and drops them when the situation changes.","Is first choice for the impossible job and last for the routine one."],
    roles:"Venture Capital, Trading, Startups, Activist Investing, Distressed Asset Acquisition"
  },
  'DUNE':{
    name:'FOUR-COLOUR (No Blue)',
    tag:'Action Before Analysis',
    colors:['W','B','R','G'],
    philosophy:"You believe action reveals truth faster than analysis. Overthinking looks to you like fear of being wrong, so you move fast and fix your mistakes as you go.",
    desc:"You commit on instinct and figure things out in motion, skipping the analysis that would slow you down.",
    pubBanter:"",
    cmd:'Saskia the Unyielding',
    cmdDesc:'As Saskia enters, choose a player. Whenever your creatures deal combat damage to a player, they deal the same damage to the chosen player.',
    str:["Gets a stalled decision made in a single phone call.","Notices when the team has gone quiet in the wrong way.","Has people who will follow them into the next project before they've heard what it is."],
    weak:["Has shipped the thing on Tuesday and is fixing the thing on Wednesday.","Doesn't trust an answer that needed a spreadsheet.","Hears 'let's sleep on it' as 'let's not'."],
    roles:"Sales, Crisis Response, Live Events, Field Operations, Military"
  },
  'INK':{
    name:'FOUR-COLOUR (No Black)',
    tag:'Altruism Without an Angle',
    colors:['W','U','R','G'],
    philosophy:"You believe work is worth doing when it helps someone other than you. You're proud that you've never exploited anyone, though it has sometimes left you holding the bill.",
    desc:"You help people and build things that serve others, and what's in it for you rarely comes up.",
    pubBanter:"You told the recruiter your salary expectations were 'whatever is fair'.",
    cmd:'Kynaios and Tiro of Meletis',
    cmdDesc:'At the beginning of your end step, you draw a card. Each player may then put a land onto the battlefield from their hand, and each opponent who didn\'t draws a card.',
    str:["Makes cynical colleagues a little less cynical.","Knows the night security guard's name, and the name of his dog.","Asks who a project is for, then checks it works for them."],
    weak:["Extends the benefit of the doubt to people who used theirs up long ago.","Has a diary full of other people's good causes.","Gives the credit away so often that their manager has lost track of what they did."],
    roles:'Nonprofits, Education, Community Building, Social Enterprise, Cooperative Movement, Public Health'
  },
  'WUBRG':{
    name:'FIVE-COLOUR',
    tag:'All of the Above',
    colors:['W','U','B','R','G'],
    philosophy:"You believe every approach has its place. You size up the situation first, then become whichever colleague it needs.",
    desc:"You can draw on every approach, which makes you either a Renaissance person or a generalist who hasn't picked one yet.",
    pubBanter:"",
    cmd:'Kenrith, the Returned King',
    cmdDesc:'Kenrith has an ability in each of the five colours, from giving every creature haste to bringing one back from a graveyard.',
    str:["Can take the technical role on Monday and the people role on Tuesday.","Can explain each side of an argument to the other, and both sides trust the explanation.","Notices the job that has fallen between two people, and does it."],
    weak:["Struggles with the question 'but what do you think?'","Gets asked to cover for everyone, so rarely finishes their own work.","Is so useful in every team that no team quite claims them."],
    roles:'Consulting, Chief of Staff, Facilitation, Interpreting, General Practice, Portfolio Management'
  }
};

// MANA_BASE_LANDS
// Land names for the 37-land Commander mana base on the results page (player
// mode only); the wording around them is RESULT_COPY.manaBase in index.html.
// Colour keys are in WUBRG order: 'UB' is Dimir, 'UBG' is Sultai. Card names
// follow the fan-content practice already used for the commanders; every name
// here was checked against Scryfall on 17 October 2026 (copy drafts,
// revision 2, section 10). A land outside the commander's colours is illegal
// in the deck, so the next-door neighbour's land is only ever a maybeboard
// line, outside the 37.
const MANA_BASE_LANDS = {
  basics: { W: 'Plains', U: 'Island', B: 'Swamp', R: 'Mountain', G: 'Forest' },
  // Opens every two- and three-colour base; four and five colours start with
  // it as part of `wide`.
  commandTower: 'Command Tower',
  // Two colours: the shock, the fetch and the check, printed in that order.
  // A shock is also the maybeboard land for a mono or four-colour result.
  pairs: {
    WU: { shock: 'Hallowed Fountain', fetch: 'Flooded Strand',    check: 'Glacial Fortress' },   // Azorius
    UB: { shock: 'Watery Grave',      fetch: 'Polluted Delta',    check: 'Drowned Catacomb' },   // Dimir
    BR: { shock: 'Blood Crypt',       fetch: 'Bloodstained Mire', check: 'Dragonskull Summit' }, // Rakdos
    RG: { shock: 'Stomping Ground',   fetch: 'Wooded Foothills',  check: 'Rootbound Crag' },     // Gruul
    WG: { shock: 'Temple Garden',     fetch: 'Windswept Heath',   check: 'Sunpetal Grove' },     // Selesnya
    WB: { shock: 'Godless Shrine',    fetch: 'Marsh Flats',       check: 'Isolated Chapel' },    // Orzhov
    UR: { shock: 'Steam Vents',       fetch: 'Scalding Tarn',     check: 'Sulfur Falls' },       // Izzet
    BG: { shock: 'Overgrown Tomb',    fetch: 'Verdant Catacombs', check: 'Woodland Cemetery' },  // Golgari
    WR: { shock: 'Sacred Foundry',    fetch: 'Arid Mesa',         check: 'Clifftop Retreat' },   // Boros
    UG: { shock: 'Breeding Pool',     fetch: 'Misty Rainforest',  check: 'Hinterland Harbor' }   // Simic
  },
  // Three colours: the Triome, then the three shocks. Shard Triomes are from
  // Streets of New Capenna, wedge Triomes from Ikoria. A Triome is also the
  // maybeboard land for a two- or three-colour result.
  triples: {
    WUG: { triome: "Spara's Headquarters",     shocks: ['Temple Garden', 'Hallowed Fountain', 'Breeding Pool'] }, // Bant
    WUB: { triome: "Raffine's Tower",          shocks: ['Hallowed Fountain', 'Watery Grave', 'Godless Shrine'] }, // Esper
    UBR: { triome: "Xander's Lounge",          shocks: ['Watery Grave', 'Blood Crypt', 'Steam Vents'] },          // Grixis
    BRG: { triome: "Ziatora's Proving Ground", shocks: ['Blood Crypt', 'Stomping Ground', 'Overgrown Tomb'] },    // Jund
    WRG: { triome: "Jetmir's Garden",          shocks: ['Stomping Ground', 'Temple Garden', 'Sacred Foundry'] },  // Naya
    WBG: { triome: 'Indatha Triome',           shocks: ['Godless Shrine', 'Overgrown Tomb', 'Temple Garden'] },   // Abzan
    WUR: { triome: 'Raugrin Triome',           shocks: ['Steam Vents', 'Sacred Foundry', 'Hallowed Fountain'] },  // Jeskai
    UBG: { triome: 'Zagoth Triome',            shocks: ['Overgrown Tomb', 'Breeding Pool', 'Watery Grave'] },     // Sultai
    WBR: { triome: 'Savai Triome',             shocks: ['Sacred Foundry', 'Godless Shrine', 'Blood Crypt'] },     // Mardu
    URG: { triome: 'Ketria Triome',            shocks: ['Breeding Pool', 'Steam Vents', 'Stomping Ground'] }      // Temur
  },
  // Four and five colours: these four, then the shocks and Triomes inside the
  // colours (from the two tables above), counted rather than named.
  wide: ['Command Tower', 'Mana Confluence', 'City of Brass', 'Exotic Orchard'],
  // One colour: 36 basics and one utility land.
  mono: { W: 'Castle Ardenvale', U: 'Castle Vantress', B: 'Cabal Coffers', R: 'Hanweir Battlements', G: "Gaea's Cradle" }
};
