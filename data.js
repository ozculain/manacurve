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
    context: "The town festival you've spent a year organising opens in 48 hours, and half of it is falling apart.",
    responses: {
      'MONO-W': 'Keep every promise made to the stallholders, whatever it costs.',
      'MONO-U': "Find out exactly what's broken before anyone fixes anything.",
      'MONO-B': "Buy our way out with the sponsors' money.",
      'MONO-R': 'Throw myself at it now, heart and soul.',
      'MONO-G': "Run it the way it's always run. People come for that.",
      'AZORIUS': 'Write one plan, with a named job for each volunteer.',
      'DIMIR': "Keep it quiet while I learn who's been hiding problems.",
      'RAKDOS': "Tear up the programme. A wilder party, with whatever's left.",
      'GRUUL': 'A few mates with toolboxes can fix most of this.',
      'SELESNYA': "Bring everyone together for an hour first. We'll get through it as one.",
      'ORZHOV': "Call in every favour I'm owed. Whoever comes through gets remembered.",
      'IZZET': 'Rig up three quick fixes tonight to see which one holds.',
      'GOLGARI': 'Let the broken half go. The stalls that work get its space.',
      'BOROS': "Rally everyone: this town's festival opens on time.",
      'SIMIC': 'Fix the smallest problems first, building from there.',
      'BANT': 'Pace the two days around what each team says it needs.',
      'ESPER': 'Every call is mine, made on the facts each team brings.',
      'GRIXIS': 'Push everyone hard down the fastest route. Some will hate me for it.',
      'JUND': "Dig in for two sleepless nights. I've survived worse than this.",
      'NAYA': 'Get the whole town in to help. Setting up can be the party.',
      'ABZAN': 'Save the parts people have loved for decades first.',
      'JESKAI': 'Rehearse the opening with every volunteer until it runs like clockwork.',
      'SULTAI': 'Open it small, positioned to grow next year.',
      'MARDU': 'Orders go out tonight. Everyone gives up their weekend, me first.',
      'TEMUR': 'Change the plan hour by hour as new problems show up.',
      'WITCH': 'No rushing. If it needs another day, it opens a day late.',
      'GLINT': "The council's rules can wait two days. The paperwork can follow.",
      'DUNE': 'No meetings. Start fixing now, mistakes and all.',
      'INK': "Cover any volunteer's costs from my own pocket.",
      'YORE': 'Rethink the whole layout tonight with my sharpest friends.',
      'WUBRG': "The job nobody's doing is the one I'll take."
    }
  },
  CONFLICT: {
    id: 'CONFLICT',
    context: 'Two members of a club you chair are arguing hard over how to spend its savings, and the casting vote is yours.',
    responses: {
      'MONO-W': "Vote by the club's rules on spending, wherever they lead.",
      'MONO-U': 'Ask each for their costings in writing before I vote.',
      'MONO-B': "Vote for the plan that's best for me.",
      'MONO-R': 'Vote with my heart, tonight.',
      'MONO-G': 'Wait. Most rows in the club blow over by spring.',
      'AZORIUS': 'A scoring sheet for both plans. The scores decide.',
      'DIMIR': 'Talk to each alone, listening for what they leave out.',
      'RAKDOS': 'Back the bolder plan. A club that plays safe goes stale.',
      'GRUUL': 'My gut picks one. I tell them both straight.',
      'SELESNYA': 'Sit them down together, as often as it takes, until they agree.',
      'ORZHOV': 'Side with whoever has given the club most over the years.',
      'IZZET': 'A small trial of each plan first. The better one gets the rest.',
      'GOLGARI': 'Let the losing plan die. Its best idea can grow back next year.',
      'BOROS': 'Fight for the plan I believe in at every meeting.',
      'SIMIC': 'Change the bolder plan bit by bit until both can live with it.',
      'BANT': 'A small group costs both plans, reporting back in a month.',
      'ESPER': "I'll decide, with my reasons explained afterwards.",
      'GRIXIS': 'Make them pitch head to head tomorrow. The winner gets my full weight.',
      'JUND': 'Whichever plan keeps the club fighting fit.',
      'NAYA': 'Whichever plan more members will turn up to help with.',
      'ABZAN': "The safer plan, closer to what's served the club for years.",
      'JESKAI': "Run it as a debate, with each arguing the other's side.",
      'SULTAI': 'Quietly vote for whatever grows the savings over ten years.',
      'MARDU': 'They get an hour to agree. After that, I decide.',
      'TEMUR': 'Whichever fits this year. Next year might need the other.',
      'WITCH': 'No vote this month. I want five years of figures on both.',
      'GLINT': 'Forget the rulebook. Whatever gets results gets my vote.',
      'DUNE': "Pick one and start. We'll know within a week if it's wrong.",
      'INK': "Back whichever plan does most for the members who can't afford much.",
      'YORE': 'Ask them both for a third idea that beats theirs.',
      'WUBRG': "Vote for whatever the club's mood says it needs now."
    }
  },
  PIVOT: {
    id: 'PIVOT',
    context: 'A chance has come up to spend a year doing what you love most, on much less money, and it might lead nowhere.',
    responses: {
      'MONO-W': "Talk it through with my family first. They'd carry the risk too.",
      'MONO-U': "Ask everyone who's done it before how it turned out.",
      'MONO-B': 'Only if it puts me in front of people who can open doors.',
      'MONO-R': 'Yes, straight away. My whole body says go.',
      'MONO-G': 'Let it pass. The life I have suits me.',
      'AZORIUS': 'Go, with a written plan and a date to review it.',
      'DIMIR': "Say nothing to anyone until I know exactly what I'd be giving up.",
      'RAKDOS': 'Take it, and enjoy every minute while it lasts.',
      'GRUUL': 'Go. My grandad lived on less, doing what he loved.',
      'SELESNYA': "Go, if I'd be doing it among people I belong with.",
      'ORZHOV': 'Yes, as long as it comes with a proper title and some say.',
      'IZZET': "Treat it as a year-long experiment. I'll learn either way.",
      'GOLGARI': 'Yes. Some things in my life need to end.',
      'BOROS': "Go, ready to fight anyone who says it can't be done.",
      'SIMIC': "Accept, and grow into the parts I can't do yet.",
      'BANT': 'Ask them to wait six months while I save up a cushion.',
      'ESPER': 'Accept, but on terms I set and enforce myself.',
      'GRIXIS': 'Take it. A year ahead of everyone who waited.',
      'JUND': 'Go. Sheer graft will make it pay.',
      'NAYA': 'Go for it. My friends will back me if it folds.',
      'ABZAN': "Turn it down. What I've built over the years matters more.",
      'JESKAI': 'Yes, working at it ten hours a day.',
      'SULTAI': "Not yet. I'll set it up quietly on the side first.",
      'MARDU': 'Commit today. Anything that would hold me back goes.',
      'TEMUR': 'Yes, changing course whenever it stops fitting.',
      'WITCH': 'Run the numbers calmly. If they work, accept.',
      'GLINT': 'Go, ignoring anyone who calls it irresponsible.',
      'DUNE': 'Jump, and sort out the money on the way down.',
      'INK': "If the work does some good, yes. I'll manage on less.",
      'YORE': "Go. I'd build something out of it nobody's tried.",
      'WUBRG': 'It comes down to what my life is short of right now.'
    }
  },
  MISTAKE: {
    id: 'MISTAKE',
    context: 'You booked a big group holiday for the wrong dates, and it has cost your friends a lot of money.',
    responses: {
      'MONO-W': 'Pay everyone back in full, in the order they paid me.',
      'MONO-U': 'Read every booking email to see exactly where it went wrong.',
      'MONO-B': 'Use my contacts to get us a better deal than before.',
      'MONO-R': 'Tell them all tonight, however angry they get.',
      'MONO-G': 'Put it right, and let it go.',
      'AZORIUS': 'Set up a fair way to share the cost, written down for all.',
      'DIMIR': 'Find the small print that makes the company share the blame.',
      'RAKDOS': 'Laugh it off, and book somewhere even better on the new dates.',
      'GRUUL': 'Ring the hotel myself. Plain words usually sort these things.',
      'SELESNYA': "Lean on the group. We've sorted worse out together.",
      'ORZHOV': "Pay what I owe. I'd expect the same if one of them slipped.",
      'IZZET': 'Try every trick for swapping the dates until one sticks.',
      'GOLGARI': "Write off the lost money. Salvage what's left of the trip.",
      'BOROS': 'Fight the travel company for the refund, for all of us.',
      'SIMIC': 'Fix the bookings one by one, checking each as I go.',
      'BANT': "A week of talking to each friend, until there's a plan nobody resents.",
      'ESPER': 'Work out what each person lost. The payback is my decision.',
      'GRIXIS': 'Squeeze the weakest link in the chain for the refund.',
      'JUND': 'Take the hit and keep going.',
      'NAYA': 'Everyone round for dinner, planning a new trip together.',
      'ABZAN': "Take the telling-off. My friends know what I've done for them.",
      'JESKAI': 'Write a booking checklist I never skip again.',
      'SULTAI': 'Quietly negotiate credit with the company for a better trip next year.',
      'MARDU': 'Say who fixes what. We fix it tonight.',
      'TEMUR': 'Switch to whatever trip the new dates allow.',
      'WITCH': 'Take a week, quietly, to find the cheapest fix.',
      'GLINT': 'Push the company hard, using any loophole I can find.',
      'DUNE': 'Grab the first refund on offer. No dwelling.',
      'INK': 'Cover the costs of the friends who can least afford it.',
      'YORE': "Hand the group's bookings to the sharpest of us, with a new system.",
      'WUBRG': 'Ask each friend what would put it right for them.'
    }
  },
  BURNOUT: {
    id: 'BURNOUT',
    context: "You're exhausted, and between home and everything you've agreed to, there's more on your plate than you can carry.",
    responses: {
      'MONO-W': 'Do my fair share, and not a scrap more.',
      'MONO-U': "Work out exactly where the time's going before changing anything.",
      'MONO-B': 'Pay someone to take the jobs I hate.',
      'MONO-R': "Tell everyone today what I'm dropping, and drop it.",
      'MONO-G': 'A week of early nights first.',
      'AZORIUS': 'A written rota for the household, on the fridge by tonight.',
      'DIMIR': "Quietly work out who's been leaving their share to me.",
      'RAKDOS': 'Book myself a weekend away. The rest can wait.',
      'GRUUL': "Go back to the simple routine that's always worked for me.",
      'SELESNYA': "Ask family and friends to share the load. That's what we're for.",
      'ORZHOV': "Call in a few favours I'm owed.",
      'IZZET': 'Rig up a shortcut for the worst chore to see if it sticks.',
      'GOLGARI': 'Let some of it quietly lapse. Nobody will miss most of it.',
      'BOROS': 'Finish what people are counting on me for, and rest after.',
      'SIMIC': 'One new habit a week. The ones that help, I keep.',
      'BANT': 'Agree with my family a load I could keep up for good.',
      'ESPER': "Hand off everything I don't need to decide myself.",
      'GRIXIS': 'Push every deadline back hard. People can wait.',
      'JUND': "Get through it. I've come out of worse stretches stronger.",
      'NAYA': 'Get everyone out for a night. Their energy keeps me going.',
      'ABZAN': 'Pace myself, as I did the last time it got this bad.',
      'JESKAI': 'Strict hours, kept to the minute.',
      'SULTAI': 'Say yes only to the things that will matter in a year.',
      'MARDU': 'Draw up who does what at home. Done by Sunday.',
      'TEMUR': 'Switch things round: hard jobs in the morning, evenings off.',
      'WITCH': 'List it all calmly. Whatever can safely wait, waits.',
      'GLINT': "Renegotiate everything I've agreed to, starting with the biggest.",
      'DUNE': 'Stop thinking about it and crack on. The thinking is what tires me.',
      'INK': 'Only help the people who need me most, for now.',
      'YORE': 'Redesign my whole week from scratch.',
      'WUBRG': 'Be whatever this week needs from me.'
    }
  },
  BETRAYAL: {
    id: 'BETRAYAL',
    context: 'A close friend has passed on something you told them in confidence, and now half your circle knows.',
    responses: {
      'MONO-W': 'Ask them to apologise to me, and to whoever else it touched.',
      'MONO-U': 'First work out why they did it.',
      'MONO-B': 'Take charge of the story myself. They back my version.',
      'MONO-R': 'Ring them tonight and tell them exactly how angry I am.',
      'MONO-G': 'Let it settle. Most of them will have forgotten by summer.',
      'AZORIUS': 'Ask the circle to hear both sides before anyone takes a view.',
      'DIMIR': "Say nothing while I find out who else they've told things to.",
      'RAKDOS': 'Own it loudly: tell everyone the full story myself.',
      'GRUUL': 'Have it out over a pint, the old way.',
      'SELESNYA': 'Keep them close. Friends this old are family.',
      'ORZHOV': 'They owe me one now, and they know it.',
      'IZZET': "Ask them, half joking, what they'd do in my place.",
      'GOLGARI': "Let the friendship run its course. Some end, and that's fine.",
      'BOROS': 'Set the record straight in front of the whole circle.',
      'SIMIC': 'Rebuild trust slowly, with small confidences first.',
      'BANT': 'Talk it through gently until we agree what stays private.',
      'ESPER': "Decide alone what the friendship's worth. They'll hear my decision.",
      'GRIXIS': 'Move first: tell the circle what they did before they can spin it.',
      'JUND': "Cut them loose. I don't carry people who let me down.",
      'NAYA': 'Throw a dinner for the whole circle to clear the air.',
      'ABZAN': "Forgive it, but they'll earn back my trust over years.",
      'JESKAI': 'Hold myself to a higher standard: no more gossip from me either.',
      'SULTAI': 'Stay friendly, and quietly stop telling them anything that matters.',
      'MARDU': 'Call them in to spell out what happens if they do it again.',
      'TEMUR': 'Adjust: they get a smaller part of my life now.',
      'WITCH': 'Wait a month. What they do next decides it.',
      'GLINT': 'Shrug. What the circle thinks has never steered me.',
      'DUNE': 'Take them aside and say I know. No speeches.',
      'INK': 'Forgive them. My worry is whether anyone else got hurt.',
      'YORE': 'Start a new circle of friends who can keep things to themselves.',
      'WUBRG': 'Answer to match how sorry they are.'
    }
  },
  ETHICS: {
    id: 'ETHICS',
    context: "You learn that your bank does something legal but dodgy. It's why its savings rate is the best around.",
    responses: {
      'MONO-W': "Move my money. I won't earn from something unfair to others.",
      'MONO-U': 'Read up on what it does until I understand exactly who loses.',
      'MONO-B': "Keep the account. It's legal, and the rate is good for me.",
      'MONO-R': "Tell everyone I know what it's doing, today.",
      'MONO-G': 'Leave it. Banks have always been like this.',
      'AZORIUS': 'Write to the regulator, asking for a rule that stops it.',
      'DIMIR': 'Say nothing. First I want to know who else knows.',
      'RAKDOS': 'Spend the extra interest on something fun, and stop thinking about it.',
      'GRUUL': "Pull it out. My gut says that's the end of it.",
      'SELESNYA': 'Back the campaign of the people it hurts.',
      'ORZHOV': "Stay. It's a big, respectable bank, and that's good enough for me.",
      'IZZET': 'Open a second account at a cleaner bank to compare for a year.',
      'GOLGARI': 'Move to a small new bank. Dodgy old banks die off in the end.',
      'BOROS': 'Go public, and get other customers to fight it with me.',
      'SIMIC': 'Move my money to a cleaner bank, a bit each month.',
      'BANT': 'Raise it properly, giving them a year to change before I move.',
      'ESPER': 'If the risk to me outweighs the rate, I move.',
      'GRIXIS': 'Use what I know to get a better deal out of them.',
      'JUND': 'Take every penny it pays until the day it stops paying.',
      'NAYA': 'Get friends and neighbours to move their money with me, all on one day.',
      'ABZAN': "Move to a building society that's treated people well for a century.",
      'JESKAI': "Set myself a strict rule: no money anywhere I haven't checked.",
      'SULTAI': "Stay for now. I'll move quietly, before others notice.",
      'MARDU': 'Walk into the branch today and demand to see the manager.',
      'TEMUR': 'Switch to a different kind of saving altogether.',
      'WITCH': 'Take quiet advice first. No rash moves with savings.',
      'GLINT': 'Find an even better rate elsewhere, dodgy or not.',
      'DUNE': 'Close the account today. Details later.',
      'INK': 'Give every penny of the extra interest away.',
      'YORE': 'Set up a savings club with friends that does it properly.',
      'WUBRG': "See what the other customers do, and do what they won't."
    }
  },
  MTG_STALL: {
    id: 'MTG_STALL',
    context: "It's the final game of your store's Commander league, with the title at stake. After 40 minutes, nobody will attack.",
    responses: {
      'MONO-W': 'Protect the player with the smallest board.',
      'MONO-U': 'Map what every player can still do before I make a move.',
      'MONO-B': 'Pay life for cards until I hold the strongest hand.',
      'MONO-R': 'Attack now. Someone has to make this game happen.',
      'MONO-G': 'Wait. My deck gets stronger the longer this goes.',
      'AZORIUS': 'Propose a rule for the table: nobody counters the first attack.',
      'DIMIR': "Keep passing, and let them guess what I'm holding.",
      'RAKDOS': 'Throw everything at one player and watch the table erupt.',
      'GRUUL': 'Swing with my biggest creature. Simple usually works.',
      'SELESNYA': 'Build up alongside the friendliest player.',
      'ORZHOV': "Offer protection to anyone who'll back me later.",
      'IZZET': 'Try a strange line nobody expects, just to see what happens.',
      'GOLGARI': 'Trade creatures off freely. My graveyard is my second hand.',
      'BOROS': 'Call out the leader and lead the attack on them.',
      'SIMIC': 'Grow my creatures a little every turn.',
      'BANT': 'Keep the table balanced, and step in only when someone runs away with it.',
      'ESPER': 'Keep the board locked down until my win is certain.',
      'GRIXIS': "Turn the others on each other, and finish whoever's left.",
      'JUND': 'Outlast them all. My deck was built for long, ugly games.',
      'NAYA': 'Team up with the two players next to me to go in together.',
      'ABZAN': 'Sit tight behind my defences, gaining life every turn.',
      'JESKAI': 'Play tight, careful turns until my winning one comes.',
      'SULTAI': 'Pick off whoever overcommits first.',
      'MARDU': 'Sacrifice half my board to make one attack nobody can stop.',
      'TEMUR': 'Hold up mana, and flash in a big threat at the end of a turn.',
      'YORE': 'Assemble my artifact combo and win in one turn.',
      'GLINT': 'Deal with everyone, keeping only the deals that still help me.',
      'DUNE': 'Attack before the slower decks find their answers.',
      'INK': 'Hand out a few cards so the game can move again.',
      'WITCH': 'Draw no attention while they use up their answers.',
      'WUBRG': 'After a turn of watching, fill whatever gap the table leaves.'
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
    pubBanter:"You've been asked to stop quoting the office fridge policy by paragraph number.",
    cmd:'Elesh Norn, Grand Cenobite',
    cmdDesc:'Your other creatures get +2/+2, and your opponents\' creatures get -2/-2.',
    str:["Will hold a team together past the point most people would have given up.","Has turned down a promotion that came with a favour attached.","Gets asked by new starters, because they'll get the same answer as everyone else.","Makes decisions that stick, because everyone saw how they were made."],
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
    tag:'Power Through Agency',
    colors:['B'],
    philosophy:"You believe everyone should be acting in their own interest. Power is what lets you change what happens around you, so you go after it openly.",
    desc:"People around you are often still catching up with a situation you've already read and acted on.",
    pubBanter:"You've already picked out which desk you're having when your manager leaves.",
    cmd:"K'rrik, Son of Yawgmoth",
    cmdDesc:'K\'rrik lets you pay 2 life instead of black mana, and lifelink heals some of it back.',
    str:["Goes after the outcome they want without waiting to be asked.","Knows what each person in a negotiation needs to walk away with.","Makes the unpopular call on a Friday afternoon and sleeps fine that night."],
    weak:["Is thrown by colleagues who aren't keeping score.","Pulls the lever and is surprised when the people attached to it object.","Wins quarters in a way that makes the next quarter harder.","Justifies hard calls by saying anyone would do the same if they were honest about it."],
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
    weak:["Reads three sentences of the brief and assumes the rest.","Has restarted a slow project from scratch because waiting was boring.","Leaves a low hum of property damage in their wake.","Runs at full output for six weeks, then is unreachable for a fortnight."],
    roles:'Startups, Sales, Crisis Response, Creative Industries, Frontline Operations, Live Events'
  },
  'MONO-G':{
    name:'MONO-GREEN',
    tag:'Growth Through Acceptance',
    colors:['G'],
    philosophy:"You believe nature got it right the first time. Things that have worked for years usually keep working, and you grow by accepting your place in the larger system.",
    desc:"You trust proven patterns. Updating one takes you a while, but you'll do it when you have to.",
    pubBanter:"You still have the fax number in your email signature, just in case.",
    cmd:'Omnath, Locus of Mana',
    cmdDesc:"Omnath doesn't lose green mana as steps and phases end, and grows +1/+1 for each unspent green mana you have.",
    str:["Has been with the company nine years and remembers, without checking, why that policy exists.","Knows the difference between a thing that is broken and a thing that is healing, and will let the second one finish.","Builds processes the way other people build sheds, for weather they have personally seen."],
    weak:["Has politely outlasted three reorgs and the people who proposed them.","Treats every new suggestion as an interesting thing happening to other people.","Will let a problem deepen on the theory that it might resolve itself.","The transition was discussed in March, and is still being discussed in October."],
    roles:"Farming, Conservation, Facilities, Estate Management, Mentoring"
  },
  'AZORIUS':{
    name:'AZORIUS',
    tag:'Order Through Knowledge',
    colors:['W','U'],
    philosophy:"You believe good outcomes come from fair rules, applied carefully and consistently. You don't mind decisions taking longer if they're made properly.",
    desc:"You build the process and make sure it applies to everyone equally. Written down properly, it keeps working after you've moved on.",
    pubBanter:"You wrote the sign-off process for the office birthday cake.",
    cmd:'Grand Arbiter Augustin IV',
    cmdDesc:'Your White and Blue spells cost {1} less; opponents\' spells cost {1} more.',
    str:["Designs the process that stops last year's disaster from happening again.","Documents the decision and the dissent.","Builds systems where the wrong answer is hard to reach, even on purpose."],
    weak:["Has prepared a framework for selecting the framework.","Will apply the letter of a rule in an emergency it was never written for.","Confuses 'the rule has been followed' with 'the problem has been solved'."],
    roles:'COO, Compliance, Strategic Planning, Governance, General Counsel, Risk Management'
  },
  'SELESNYA':{
    name:'SELESNYA',
    tag:'Community Through Nature',
    colors:['W','G'],
    philosophy:"You believe people thrive when they belong to something larger than themselves. Communities, like trees, take a long time to grow and longer to repair, so you'll go slowly if it keeps a team together.",
    desc:"You notice who is struggling before they say anything.",
    pubBanter:"You organised a leaving do for someone who was only going on holiday.",
    cmd:"Trostani, Selesnya's Voice",
    cmdDesc:'Whenever another creature you control enters, you gain life equal to its toughness. Pay {1}{G}{W} and tap Trostani to populate: copy a creature token you control.',
    str:["Remembers the names of everyone's children and which one is having a hard year, and acts on it.","Builds a team that, three years in, still likes each other.","Finds the version of the plan that nobody has to lose for it to work."],
    weak:["Has been rehearsing the same difficult conversation in their head since spring.","Keeps a struggling colleague in a job they can't do, because letting them go feels cruel.","Waits for hard decisions to become gentle ones."],
    roles:'Chief People Officer, HR, Team Leads, Community Programmes, Volunteer Coordination'
  },
  'ORZHOV':{
    name:'ORZHOV',
    tag:'Structure Through Power',
    colors:['W','B'],
    philosophy:"You believe structure is the foundation of ambition. A hierarchy keeps things in order, and the people who build and maintain it should do well out of it.",
    desc:"You have a rule-builder's patience and a player's eye for advantage. The hierarchies you build serve the organisation and serve you, and you see no conflict between the two.",
    pubBanter:"Your expense claims are immaculate. So is your memory of everyone else's.",
    cmd:'Obzedat, Ghost Council',
    cmdDesc:'When Obzedat enters, an opponent loses 2 life and you gain 2. It can leave at your end step and return at your next upkeep with haste.',
    str:["Writes rules that get followed without anyone being chased.","Designs the hierarchy where the right people advance and the merely loud ones politely stall.","Holds the institutional memory, including the parts the institution has been trying to forget.","Can find the budget, and knows who to talk to if there isn't one."],
    weak:["Still mentions the small favour they did a colleague three years ago.","Promotes the deserving and the indebted, and people aren't sure which they are.","Applies the policy in full to other teams, and with some discretion to their own."],
    roles:"COO, Finance, Law, Private Banking, Estate Planning, Senior Management, Institutional Investing"
  },
  'DIMIR':{
    name:'DIMIR',
    tag:'Intelligence Through Control',
    colors:['U','B'],
    philosophy:"You believe knowledge is the most reliable form of leverage. Most of yours comes from noticing what people leave out, which you keep to yourself until it's useful.",
    desc:"Most of the time you know what everyone around you is after, but you rarely let on.",
    pubBanter:"You've read every reply-all thread in the building and replied to none.",
    cmd:"Yuriko, the Tiger's Shadow",
    cmdDesc:'Yuriko swaps in for an unblocked attacker. When your Ninjas hit a player, you reveal your top card and put it in your hand. Each opponent loses life equal to its mana value.',
    str:["Knows what a piece of information is worth and when to use it.","Has spotted three of the last five problems first.","Trades favour for favour without ever calling it that, and keeps count.","Adapts faster when the rules change, because they were watching for that already."],
    weak:["Gathers information and favours faster than they can turn them into results.","Has been told they're hard to read, and took it as a compliment.","Finds it hard to be trusted quickly, because nobody has ever seen their whole hand.","Carries everyone's secrets and pretends it isn't exhausting."],
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
    weak:["Has three projects on the go. One of them is on fire.","Loses interest exactly when the idea has to become a thing anyone else can use.","Documentation is a problem for next quarter.","Underestimates how much other people value something that works, however badly.","Will solve the wrong problem brilliantly."],
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
    weak:["Has called a fire drill 'process for the sake of process'.","Will burn down the agenda when given enough latitude.","Treats nuance as someone else's job, which works until they're on their own.","Deals with things quickly, and only sometimes well."],
    roles:"Emergency Services, Sport, Field Engineering, Sales, Operations"
  },
  'RAKDOS':{
    name:'RAKDOS',
    tag:'Freedom Through Chaos',
    colors:['B','R'],
    philosophy:"You believe most rules are there to stop people enjoying themselves. If you want something you take it and live with the consequences.",
    desc:"Nobody has to guess what you want, because you go after it openly. You also do what you say you'll do.",
    pubBanter:"You've been banned from organising the Christmas party, twice.",
    cmd:'Rakdos, Lord of Riots',
    cmdDesc:'You can cast Rakdos only after an opponent has lost life this turn. Your creature spells then cost {1} less for each life your opponents have lost.',
    str:["Ends meetings that have lost their point.","Will say what everyone was thinking but nobody planned to say.","Comes alive in a crisis.","Treats company-line phrases with suspicion."],
    weak:["Gets bored during a stable, successful stretch and starts causing trouble.","Has been described as 'lots of fun' and 'the reason two people left' in the same review.","Will undermine an institution they need, on principle, then be surprised it's gone.","Makes jokes at moments that needed someone to be serious."],
    roles:'Disruptive Startups, Aggressive Sales, Entertainment, Activism, Creative Direction'
  },
  'GOLGARI':{
    name:'GOLGARI',
    tag:'Growth Through Decay',
    colors:['B','G'],
    philosophy:"You believe nothing is wasted. Endings and failures are part of how things grow. Letting something die when its time has come doesn't trouble you.",
    desc:"You're patient and clear about your own interests. When a project dies, you keep whatever is still useful from it. People come to you after a failure, or when they want to understand the long game.",
    pubBanter:"The office plants are thriving on last year's strategy documents.",
    cmd:'Meren of Clan Nel Toth',
    cmdDesc:'Whenever another creature you control dies, you get an experience counter. At your end step, you get a creature card back from your graveyard, onto the battlefield if its mana value is within your experience.',
    str:["Can tell a project is dying months before the people running it can.","Will keep failing initiatives on life support exactly long enough to harvest the useful bits.","Has seen this crisis before and knows roughly when it ends."],
    weak:["Spent eighteen months telling everyone the strategy was rotting from the inside, and didn't try to fix it.","Has a folder labelled 'might be useful in three years' that contains everything from the last five years.","Offers 'something new will grow out of this' where a plan should be."],
    roles:"Recycling, Conservation, Turnarounds, Archives, Insolvency Practice"
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
    str:["Builds the version they wanted, two iterations after the version everyone settled for.","Spots the one small change that will save the team an hour a week.","Reworks an inherited process a little every month until nobody remembers the original."],
    weak:["Struggles to ship something they consider unfinished, even when 'unfinished' means 'one paragraph short on the docs'.","Polishes parts that were never the bottleneck.","Holds the team to a standard nobody else can see.","Has, at least once, made a process so robust that nobody outside it understood it."],
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
    str:["Can get a whole team angry about the right thing.","Says 'that's not fair' in the meeting, to the person responsible.","Gets the first phone call when something has gone badly wrong."],
    weak:["Treats 'let's just send an email' as a form of moral cowardice.","Turns difficult conversations into battles.","Sorts new colleagues into allies and obstacles by the end of their first week."],
    roles:"Campaigning, Trade Unions, Law Enforcement, Crisis Management, Military"
  },
  'BANT':{
    name:'BANT',
    tag:'Harmony Through Structure',
    colors:['W','U','G'],
    philosophy:"You believe most disagreements end well if people take the time to understand each other. You'll spend that time, even when others want a quick answer.",
    desc:"You run the meetings where everyone gets heard and the decision still holds five years later.",
    pubBanter:"You held a vote on whether to hold a vote, and it was close.",
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
    weak:["Finds the best answer on paper, and is the last to hear that the people it affects are upset.","Freezes when a crisis arrives before the information does.","Relies on quiet influence when a bit of loud energy would get things done faster."],
    roles:"CFO/Finance, Chief Compliance Officer, Auditing, Actuarial Work, Intelligence Analysis, Public Policy"
  },
  'GRIXIS':{
    name:'GRIXIS',
    tag:"Power Through Pressure",
    colors:['U','B','R'],
    philosophy:"You believe whoever thinks fastest and pushes hardest usually gets the outcome they want. You can live with being unpopular for a while.",
    desc:"You read a situation faster than most and act on it straight away.",
    pubBanter:"You took over the Thursday meeting in your first week.",
    cmd:'Nekusar, the Mindrazer',
    cmdDesc:'Every player draws an extra card in their draw step, and whenever an opponent draws, Nekusar deals them 1 damage.',
    str:["Gets a lot done with very few people.","Is happy to name the cost out loud and to pay it.","Opens a negotiation already knowing the other side's lowest price."],
    weak:['Has used "it\'s just business" to describe something that was, by any honest reading, slightly personal.',"Spends goodwill in the same week they earn it.","Keeps losing good people to calmer jobs."],
    roles:'Turnaround CEO, Competitive Strategy, High-Stakes Trading, Private Equity'
  },
  'JUND':{
    name:'JUND',
    tag:'Survival Through Hunger',
    colors:['B','R','G'],
    philosophy:"You believe survival rewards the hungry and the adapted. You trust the instincts that got you this far. Whatever isn't working, you cut loose before it drags you down.",
    desc:"You're at your best when a competitor shows up and there's something to fight for.",
    pubBanter:"You did interval training for the charity fun run.",
    cmd:'Prossh, Skyraider of Kher',
    cmdDesc:'When you cast Prossh, create X 0/1 Kobolds where X is the mana spent. Sacrifice another creature: Prossh gets +1/+0 until end of turn.',
    str:["Finishes the project everyone else was avoiding.",'Treats "this is hard" as a description and carries on.',"Will set a target nobody believes in, then hit it, partly out of spite.","Names who is in charge and what they want.","Has been through three layoffs and is still here."],
    weak:["Leaves the long-term cost of how they got here to whoever comes next.","Built a pace nobody else can hold and can't see why the team doesn't keep up.","Hears nuance as hesitation."],
    roles:'Aggressive Sales, Competitive Industries, Startups, Sports, Private Equity'
  },
  'NAYA':{
    name:'NAYA',
    tag:'Power Through Community',
    colors:['R','G','W'],
    philosophy:"You believe a group of people who care about the same thing can do almost anything. For you, everything starts with a team that turns up. You've worked hard to build one, and you ask a lot of it.",
    desc:"People work harder on a plan you're behind, and believe in it more.",
    pubBanter:"You start every Monday meeting with a round of applause.",
    cmd:'Samut, Voice of Dissent',
    cmdDesc:'Samut and your other creatures have haste. Pay {W} and tap Samut to untap another creature.',
    str:["Can lift people who have stopped believing in their own project.","Turns a group of strangers into a team within a few weeks.","Knows everyone and has had drinks with everyone.","Gets unlikely projects off the ground.","The earnestness is real, and other people's irony bounces off it."],
    weak:["Treats the third hour of the Tuesday call with the same energy as the first ten minutes.","Assumes the fairest idea will win the argument on its own.","Is so enthusiastic that quieter colleagues can't get a word in."],
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
    cmdDesc:'Costs {1} less for each creature card in your graveyard. Once during each of your turns, you may cast a creature from your graveyard.',
    str:["Has seen off four chief executives and one merger.","Knows which colleagues will still answer the phone in a bad year.","Keeps promises made by people who left years ago."],
    weak:["Has patiently explained why each new system won't work, and has been right twice and wrong four times.","Keeps a five-year-old pilot programme in pilot.","Has built a system in which everyone owes someone else a favour."],
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
    str:["Practises a presentation the way other people practise an instrument.","Fixes the ethical problem in a plan before it ships, without a fuss.","Can drop the script halfway through when the audience isn't with them."],
    weak:["Forgets the basics had to be learned, and starts beginners on the advanced version.","Will redo the work that was already correct because it could have been more correct.","Mentors well, but only people whose questions they find interesting."],
    roles:'Consulting, Teaching, Professional Services, Strategy'
  },
  'SULTAI':{
    name:'SULTAI',
    tag:'Growth Through Positioning',
    colors:['B','G','U'],
    philosophy:"You believe the patient player usually wins. You get in early and let time do the work.",
    desc:"You keep a patient, careful record of who holds what.",
    pubBanter:"You've been waiting for the corner office since before it was built.",
    cmd:'Sidisi, Brood Tyrant',
    cmdDesc:'When Sidisi enters or attacks, mill 3. Whenever creature cards hit your graveyard from your library, create a 2/2 Zombie.',
    str:["Plays a two-year game in which nothing seems to happen for eighteen months.","Was already in the right meeting before anyone knew which meeting was going to be the right one.","Is never the first to blink in a negotiation."],
    weak:["Needs to be in every conversation that matters, or have someone there.","Watches a struggling project until it's cheap enough to take over.","Plans so far ahead that colleagues stop asking what the plan is."],
    roles:'Private Equity, VC, Corporate Development, Real Estate'
  },
  'MARDU':{
    name:'MARDU',
    tag:'Victory Through Sacrifice',
    colors:['R','W','B'],
    philosophy:"You believe decisive action within a clear hierarchy wins. You lead from the front and set a pace that not everyone can keep.",
    desc:"The team moves at your speed, and anyone who can't keep up gets left behind.",
    pubBanter:"Your idea of a team away day is a second deadline.",
    cmd:'Alesha, Who Smiles at Death',
    cmdDesc:'Whenever Alesha attacks, you may pay {W/B}{W/B} to return a creature card with power 2 or less from your graveyard, tapped and attacking.',
    str:["Makes the call and doesn't reopen it a week later.","Knows who needs to be told what, and in which order.","Has hit deadlines that the client had already written off.","Is still holding the line when everyone else has started to negotiate."],
    weak:["The costs of getting the win never make it onto the same slide as the win.","Only slows down between Christmas and the second of January.","Approves holiday requests in principle.","Looks round after a good quarter and is briefly surprised by how few of the original team are left."],
    roles:'Turnarounds, Crisis Management, Sales, Founding Teams, Competitive Markets'
  },
  'TEMUR':{
    name:'TEMUR',
    tag:'Power Through Adaptation',
    colors:['G','U','R'],
    philosophy:"You believe each new problem probably needs a different approach from the last one. You drop an old method as soon as it stops fitting.",
    desc:"You change your approach as the situation shifts, usually sooner than the people around you.",
    pubBanter:"You went out for a sandwich and came back with a business idea and no sandwich.",
    cmd:'Surrak Dragonclaw',
    cmdDesc:"Neither Surrak nor your creatures can be countered, and your other creatures have trample.",
    str:["Will sketch the new approach in the meeting and build the prototype that night.","Has a new idea most mornings. Some of them are good.","Stays calm when the plan falls apart, having expected it to.","Will try the thing nobody got permission to try."],
    weak:["Has been on the same project for six weeks and rewritten the foundations three times.","Drops a method that works because a newer one looks more interesting.","The team has, collectively, stopped scheduling anything more than two weeks out."],
    roles:"Startups, Research, Product Design, Journalism, Expedition Leading"
  },
  'WITCH':{
    name:'FOUR-COLOR (No Red)',
    tag:'Perfection Without Haste',
    colors:['W','U','B','G'],
    philosophy:"You believe most problems are better solved slowly. You're happy to wait for the right answer, however strongly anyone feels about the wrong one.",
    desc:"You're the person whose plans are still working in three years. You take urgent requests calmly and decide whether they need any action at all.",
    pubBanter:"You asked whether your surprise party had come out of the contingency budget.",
    cmd:"Atraxa, Praetors' Voice",
    cmdDesc:'At your end step, proliferate: give each permanent and player you choose another of each kind of counter already on it.',
    str:["Wins long arguments by turning up to every meeting until the other side stops coming.","Is in year six of a ten-year plan.","Keeps a clear head when a discussion turns heated."],
    weak:['Can seem so detached that colleagues wonder whether they care about the work.','Calls a passionate idea "inefficient" before finding out what the passion was for.','Has more than once watched a crisis unfold and analysed it correctly without doing anything.'],
    roles:'Operations, Finance, Strategy, Long-term Planning, Sovereign Wealth, Patient Capital'
  },
  'YORE':{
    name:'FOUR-COLOR (No Green)',
    tag:"Innovation Without Nostalgia",
    colors:['W','U','B','R'],
    philosophy:"You believe whatever exists now is a first draft. Tradition is useful to you as information. You build a team clever enough to argue with you about what comes next.",
    desc:"You build complex systems and rebuild any part that doesn't quite fit, including parts that still work.",
    pubBanter:"You wrote a script to book a meeting room, and it now books all of them.",
    cmd:'Breya, Etherium Shaper',
    cmdDesc:'When Breya enters, create two 1/1 flying Thopter tokens. Pay {2} and sacrifice two artifacts to choose one: 3 damage to a player or planeswalker, -4/-4 to a creature, or gain 5 life.',
    str:["Can hold a whole system in their head and change it while it's running.","Is usually three steps ahead and impatient for the rest to catch up.","Will work late because the work isn't right yet.","Automates any job they've had to do twice."],
    weak:["Turns the grocery list into a system.","Distrusts any solution short enough to fit on one slide.","Works at a pace their own body has started to complain about.","Rebuilds things that were correct the first time."],
    roles:'Tech Startups, Engineering Leadership, Systems Architecture, R&D, Founders'
  },
  'GLINT':{
    name:'FOUR-COLOR (No White)',
    tag:'Power Without Permission',
    colors:['U','B','R','G'],
    philosophy:"You believe getting things done matters more than how it looks. When a rule only protects the person who made it, you work around it.",
    desc:"You have no strong loyalty to the group, so the lines other people stay inside don't hold you.",
    pubBanter:"You parked in the director's space until they gave it to you.",
    cmd:'Yidris, Maelstrom Wielder',
    cmdDesc:'When Yidris deals combat damage to a player, the spells you cast from your hand that turn gain cascade.',
    str:["Will try a move that's technically against the rules if that's the only thing stopping it from working.","Closes the deal that everyone said couldn't be done.","Routes around new constraints as if they were part of the terrain.","Knows which rules can be broken and what it will cost.","Will tear down an architecture two people built their reputations on if it stops working."],
    weak:['Treats "is this okay?" as a question for someone else\'s department.',"Makes commitments in good faith and drops them when the situation changes.","By the third quarter, the rest of the team has stopped relying on them."],
    roles:"Venture Capital, Trading, Startups, Activist Investing, Distressed Asset Acquisition"
  },
  'DUNE':{
    name:'FOUR-COLOR (No Blue)',
    tag:'Action Before Analysis',
    colors:['W','B','R','G'],
    philosophy:"You believe action reveals truth faster than analysis. Overthinking looks to you like fear of being wrong, so you move fast and fix your mistakes as you go.",
    desc:"You commit on instinct and figure things out in motion, skipping the analysis that would slow you down.",
    pubBanter:"You replied 'done' to an email asking whether to start.",
    cmd:'Saskia the Unyielding',
    cmdDesc:'As Saskia enters, choose a player. Whenever your creatures deal combat damage to a player, they deal the same damage to the chosen player.',
    str:["Cuts through the meeting that was about to go around the table for a third time.","Picks up on how a team feels without being told.","Gets things shipped without waiting for every question to be answered.","Has people who will follow them into the next project before they've heard what it is."],
    weak:["Has shipped the thing on Tuesday and is fixing the thing on Wednesday.","Doesn't trust an answer that needed a spreadsheet.","Hears 'let's sleep on it' as 'let's not'."],
    roles:"Sales, Crisis Response, Live Events, Field Operations, Military"
  },
  'INK':{
    name:'FOUR-COLOR (No Black)',
    tag:'Altruism Without an Angle',
    colors:['W','U','R','G'],
    philosophy:"You believe progress comes from serving something larger than yourself. You're proud that you've never exploited anyone, though it has sometimes left you holding the bill.",
    desc:"You help people and build things that serve others, and what's in it for you rarely comes up.",
    pubBanter:"You told the recruiter your salary expectations were 'whatever is fair'.",
    cmd:'Kynaios and Tiro of Meletis',
    cmdDesc:'At the beginning of your end step, you draw a card. Each player may then put a land onto the battlefield from their hand, and each opponent who didn\'t draws a card.',
    str:["Makes cynical colleagues a little less cynical.","Looks out for the people nobody else notices.","Asks who a project is for, then checks it works for them."],
    weak:["Is still surprised when a colleague turns out to be in it for themselves.","Has said yes to three good causes this month.","Gives the credit away so often that their manager has lost track of what they did."],
    roles:'Nonprofits, Education, Community Building, Social Enterprise, Cooperative Movement, Public Health'
  },
  'WUBRG':{
    name:'FIVE-COLOR',
    tag:'Chaos or Mastery',
    colors:['W','U','B','R','G'],
    philosophy:"You believe every approach has its place. You size up the situation first, then become whichever colleague it needs.",
    desc:"You can draw on every approach, which makes you either a Renaissance person or a generalist who hasn't picked one yet.",
    pubBanter:"You're on every committee in the building, and you chair the one that decides the committees.",
    cmd:'Kenrith, the Returned King',
    cmdDesc:'Kenrith has an ability in each of the five colours, from giving every creature haste to bringing one back from a graveyard.',
    str:['Can take the technical role on Monday and the people role on Tuesday.','Speaks five different professional dialects fluently, and switches between them mid-sentence without noticing.','Can explain each side of an argument to the other, and both sides trust the explanation.'],
    weak:["Holds five priorities and gives each one twenty percent of the energy.","Struggles with the question 'but what do you think?'","Has a CV that reads like five people's."],
    roles:'Consulting, Chief of Staff, Generalist Leadership, Facilitation, Portfolio Management'
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
