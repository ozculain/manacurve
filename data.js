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
      'DIMIR': 'Say nothing outside the team until I know the whole picture.',
      'RAKDOS': "Bin the plan. I'll run it my own way, mess and all.",
      'GRUUL': 'A few mates with toolboxes can fix most of this.',
      'SELESNYA': "Bring everyone together for an hour first. We'll get through it as one.",
      'ORZHOV': "Call in every favour I'm owed. Whoever comes through gets remembered.",
      'IZZET': 'Rig up three quick fixes tonight to see which one holds.',
      'GOLGARI': 'Let the broken half go. The stalls that work get its space.',
      'BOROS': "Rally everyone: this town's festival opens on time.",
      'SIMIC': 'Fix the smallest problems first, building from there.',
      'BANT': 'Pace the two days around what each team says it needs.',
      'ESPER': 'Every call is mine, made on the facts each team brings.',
      'GRIXIS': 'Drive everyone at full speed. Being liked can wait till Monday.',
      'JUND': "Work both nights straight, cutting whatever can't be saved.",
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
      'MONO-W': "The club's rules on spending decide it, wherever they lead.",
      'MONO-U': 'Ask each for their costings in writing before I vote.',
      'MONO-B': "My casting vote, my call. I'll make it today.",
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
      'JUND': 'The plan that keeps the club fighting fit.',
      'NAYA': 'Whichever plan more members will turn up to help with.',
      'ABZAN': "The safer plan, closer to what's served the club for years.",
      'JESKAI': "Run it as a debate, with each arguing the other's side.",
      'SULTAI': 'Quietly vote for whatever grows the savings over ten years.',
      'MARDU': 'They get an hour to agree. After that, I decide.',
      'TEMUR': "This year's needs decide it. Next year it might be the other.",
      'WITCH': 'Delay the vote, and quietly sound out every member first.',
      'GLINT': 'Back the plan that works, rulebook or not.',
      'DUNE': "Pick one and start. We'll know within a week if it's wrong.",
      'INK': "Back whichever plan does most for the members who can't afford much.",
      'YORE': 'Ask them both for a third idea that beats theirs.',
      'WUBRG': "Whatever the club's mood says it needs now gets my vote."
    }
  },
  PIVOT: {
    id: 'PIVOT',
    context: 'A chance has come up to spend a year doing what you love most, on much less money, and it might lead nowhere.',
    responses: {
      'MONO-W': "Talk it through with my family first. They'd carry the risk too.",
      'MONO-U': "Ask everyone who's done it before how it turned out.",
      'MONO-B': 'Only if it puts me in front of people who can open doors.',
      'MONO-R': "Yes, today. I've wanted this too long to wait.",
      'MONO-G': 'Let it pass. The life I have suits me.',
      'AZORIUS': 'Go, with a written plan and a date to review it.',
      'DIMIR': "Say nothing to anyone until I know exactly what I'd be giving up.",
      'RAKDOS': 'Take it, and enjoy every minute while it lasts.',
      'GRUUL': 'Go. Living simply never scared me.',
      'SELESNYA': "Go, if I'd be doing it among people I belong with.",
      'ORZHOV': 'Yes, as long as it comes with a proper title and some say.',
      'IZZET': "Treat it as a year-long experiment. I'll learn either way.",
      'GOLGARI': 'Yes. My old life has run its course.',
      'BOROS': 'Go, giving it everything from day one.',
      'SIMIC': "Accept, and grow into the parts I can't do yet.",
      'BANT': 'Ask them to wait six months while I save up a cushion.',
      'ESPER': 'Accept, but on terms I set and enforce myself.',
      'GRIXIS': 'Take it, using the year to get ahead.',
      'JUND': 'Go, living on whatever it brings in.',
      'NAYA': 'Go for it. My friends will back me if it folds.',
      'ABZAN': "Turn it down. What I've built over the years matters more.",
      'JESKAI': 'Yes, treating every day of it as training.',
      'SULTAI': "Not yet. I'll set it up quietly on the side first.",
      'MARDU': 'Commit today. Anything that would hold me back goes.',
      'TEMUR': 'Yes, changing course whenever it stops fitting.',
      'WITCH': 'Run the numbers calmly. If they work, accept.',
      'GLINT': 'Go. The sensible people can disapprove.',
      'DUNE': "Yes. I'll fix the money problem when it comes.",
      'INK': "If the work does some good, yes. I'll manage on less.",
      'YORE': "Go. I'd turn it into something new.",
      'WUBRG': 'Keep one foot in my old life, one in the new.'
    }
  },
  MISTAKE: {
    id: 'MISTAKE',
    context: 'You booked a big group holiday for the wrong dates, and it has cost your friends a lot of money.',
    responses: {
      'MONO-W': "Pay everyone back in full, starting with whoever's hardest hit.",
      'MONO-U': 'Read every booking email to see exactly where it went wrong.',
      'MONO-B': 'Use my contacts to get us a better deal than before.',
      'MONO-R': 'Tell them all tonight, however angry they get.',
      'MONO-G': 'Make amends and let it rest.',
      'AZORIUS': 'Set up a fair way to share the cost, written down for all.',
      'DIMIR': 'Find the small print that makes the company share the blame.',
      'RAKDOS': 'Turn it into an adventure: wherever we can get to on the new dates.',
      'GRUUL': 'Ring the hotel myself. Plain words usually sort these things.',
      'SELESNYA': "Lean on the group. We've sorted worse out together.",
      'ORZHOV': "Pay what I owe. I'd expect the same if one of them slipped.",
      'IZZET': 'Try every trick for swapping the dates until one sticks.',
      'GOLGARI': "Let this trip go, and use what's left of the money on another.",
      'BOROS': 'Fight the travel company for the refund, for all of us.',
      'SIMIC': 'Fix the bookings one by one, checking each as I go.',
      'BANT': "A week of talking to each friend, until there's a plan nobody resents.",
      'ESPER': 'Work out what each person lost. The payback is my decision.',
      'GRIXIS': 'Pressure whoever is weakest in the chain until they pay up.',
      'JUND': 'Eat the loss myself and get on with things.',
      'NAYA': 'Everyone round for dinner, planning a new trip together.',
      'ABZAN': 'Take the telling-off. Friendships this old can carry a mistake.',
      'JESKAI': 'Write a booking checklist I never skip again.',
      'SULTAI': 'Quietly negotiate credit with the company for a better trip next year.',
      'MARDU': 'Say who fixes what. We fix it tonight.',
      'TEMUR': 'Switch to whatever trip the new dates allow.',
      'WITCH': 'Take a week, quietly, to find the cheapest fix.',
      'GLINT': 'Push the company hard, using any loophole I can find.',
      'DUNE': 'Grab the first refund on offer. No dwelling.',
      'INK': 'Cover the costs of the friends who can least afford it.',
      'YORE': "Hand the group's bookings to the sharpest of us, with a new system.",
      'WUBRG': 'Fix it differently for each friend, depending on what they lost.'
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
      'GRUUL': 'Cut out the clutter and live simply for a while.',
      'SELESNYA': "Ask family and friends to share the load. That's what we're for.",
      'ORZHOV': "Call in a few favours I'm owed.",
      'IZZET': 'Rig up a shortcut for the worst chore to see if it sticks.',
      'GOLGARI': 'Let some of it quietly lapse. Nobody will miss most of it.',
      'BOROS': 'Finish what people are counting on me for, and rest after.',
      'SIMIC': 'One new habit a week. The ones that help, I keep.',
      'BANT': 'Agree with my family a load I could keep up for good.',
      'ESPER': 'Take control of the diary. I decide what stays.',
      'GRIXIS': 'Drop the people who keep piling things on me.',
      'JUND': "Get through it. I've come out of worse stretches stronger.",
      'NAYA': 'Get everyone out for a night. Their energy keeps me going.',
      'ABZAN': 'Pace myself, as I did the last time it got this bad.',
      'JESKAI': 'Strict hours, kept to the minute.',
      'SULTAI': 'Say yes only to the things that will matter in a year.',
      'MARDU': 'Cancel everything of my own for a month, and get it all done.',
      'TEMUR': 'Switch things round: hard jobs in the morning, evenings off.',
      'WITCH': 'List it all calmly. Whatever can safely wait, waits.',
      'GLINT': "Renegotiate everything I've agreed to, starting with the biggest.",
      'DUNE': 'Stop thinking about it and crack on. The thinking is what tires me.',
      'INK': 'Only help the people who need me most, for now.',
      'YORE': 'Redesign my whole week from scratch.',
      'WUBRG': 'Work out whether I need rest or help, and get that.'
    }
  },
  BETRAYAL: {
    id: 'BETRAYAL',
    context: 'A close friend has passed on something you told them in confidence, and now half your circle knows.',
    responses: {
      'MONO-W': 'Ask them to apologise to me, and to whoever else it touched.',
      'MONO-U': 'First work out why they did it.',
      'MONO-B': "Use it. Now I know who not to trust, and that's useful.",
      'MONO-R': 'Ring them tonight and tell them exactly how angry I am.',
      'MONO-G': 'Let it settle. Most of them will have forgotten by summer.',
      'AZORIUS': 'Ask the circle to hear both sides before anyone takes a view.',
      'DIMIR': "Say nothing while I find out who else they've told things to.",
      'RAKDOS': 'Laugh it off in public, with the joke on them.',
      'GRUUL': 'Have it out over a pint, the old way.',
      'SELESNYA': 'Keep them close. Friends this old are family.',
      'ORZHOV': 'Keep the friendship, on the understanding that they owe me.',
      'IZZET': "Ask them, half joking, what they'd do in my place.",
      'GOLGARI': "Let the friendship run its course. Some end, and that's fine.",
      'BOROS': 'Set the record straight in front of the whole circle.',
      'SIMIC': 'Rebuild trust slowly, with small confidences first.',
      'BANT': 'Talk it through gently until we agree what stays private.',
      'ESPER': "Decide alone what the friendship's worth. They'll hear my decision.",
      'GRIXIS': 'Move fast: talk to everyone before the story hardens.',
      'JUND': 'Cut them loose. No looking back.',
      'NAYA': 'Throw a dinner for the whole circle to clear the air.',
      'ABZAN': 'Thirty years of friendship outweighs one slip. It stays.',
      'JESKAI': 'Take it as a lesson, and train myself to say less.',
      'SULTAI': 'Stay friendly, and quietly stop telling them anything that matters.',
      'MARDU': "Tell them plainly: once more, and they're out.",
      'TEMUR': 'Move on fast. Friendships change shape, and this one just did.',
      'WITCH': 'Wait a month. What they do next decides it.',
      'GLINT': 'Shrug it off and carry on as I please.',
      'DUNE': 'Take them aside and say I know. No speeches.',
      'INK': 'Forgive them. My worry is whether anyone else got hurt.',
      'YORE': 'Start a new circle of friends who can keep things to themselves.',
      'WUBRG': "If they're truly sorry, forgive. If not, walk away."
    }
  },
  ETHICS: {
    id: 'ETHICS',
    context: "You learn that your bank does something legal but dodgy. It's why its savings rate is the best around.",
    responses: {
      'MONO-W': "I won't earn from something unfair. The money goes elsewhere.",
      'MONO-U': 'Read up on what it does until I understand exactly who loses.',
      'MONO-B': "Keep the account. It's legal, and the rate is good for me.",
      'MONO-R': "Tell everyone I know what it's doing, today.",
      'MONO-G': 'Leave it. Banks have always been like this.',
      'AZORIUS': 'Write to the regulator, asking for a rule that stops it.',
      'DIMIR': 'Say nothing. First I want to know who else knows.',
      'RAKDOS': 'Keep the rate, and spend the extra on something fun.',
      'GRUUL': "Put it somewhere plain and simple. My gut doesn't trust clever banks.",
      'SELESNYA': 'Back the campaign of the people it hurts.',
      'ORZHOV': 'Stay, working my way onto its customer panel to change it.',
      'IZZET': 'Open a second account at a cleaner bank to compare for a year.',
      'GOLGARI': 'Take the money out. Banks like that collapse in the end.',
      'BOROS': 'Go public, and get other customers to fight it with me.',
      'SIMIC': "A bit each month into a cleaner bank, until it's all moved.",
      'BANT': 'Raise it properly, giving them a year to change before I move.',
      'ESPER': 'If the risk to me outweighs the rate, I move.',
      'GRIXIS': 'Move my money tonight, and let the journalists know.',
      'JUND': 'Take every penny it pays until the day it stops paying.',
      'NAYA': 'Get friends and neighbours to move their money with me, all on one day.',
      'ABZAN': "Move to a building society that's treated people well for a century.",
      'JESKAI': "Set myself a strict rule: no money anywhere I haven't checked.",
      'SULTAI': "Stay for now. I'll move quietly, before others notice.",
      'MARDU': 'Walk into the branch today and demand to see the manager.',
      'TEMUR': 'Switch to a different kind of saving altogether.',
      'WITCH': 'Take quiet advice first. No rash moves with savings.',
      'GLINT': "Shop around for an even better rate. Ethics are the bank's business.",
      'DUNE': 'Close the account today. Details later.',
      'INK': 'Give every penny of the extra interest away.',
      'YORE': 'Set up a savings club with friends that does it properly.',
      'WUBRG': 'Find out who it hurts. That decides how hard I push.'
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
      'RAKDOS': 'Throw everything at one player. The chaos will sort it out.',
      'GRUUL': 'Swing with my biggest creature. Simple usually works.',
      'SELESNYA': 'Build up alongside the friendliest player.',
      'ORZHOV': "Offer protection to anyone who'll back me later.",
      'IZZET': 'Try a strange line nobody expects, to break the stalemate.',
      'GOLGARI': 'Trade creatures freely. The graveyard brings them back later.',
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
      'INK': 'Help the player furthest behind, so the game moves again.',
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
// `you`: two to four lines said to the reader's face, each the flattering
// version of a trait and the same trait as the people around you live with
// it. A turn that undoes the first half stays inside the same sentence.
// Each line is a habit in the present tense: no line, and no philosophy,
// tells the reader a past they may not have had.
// The consumer results screen, a peek next door and the share Card show
// them where Strengths and Shadows stood. Workplace mode, the explorer and the
// dossier keep `str` and `weak`. Mono-Blue's first two lines are the
// author's own, word for word, and carry the only em dash on any page.
const PROFILES = {
  'MONO-W':{
    name:'MONO-WHITE',
    tag:'Peace Through Structure',
    colors:['W'],
    philosophy:"You keep to the rules even when breaking one would save you forty quid. They're there for the person who can't argue back, and one day that might be you.",
    desc:"You make sure the rules apply to everyone and outlast whoever wrote them. If someone is getting special treatment, you notice and say so.",
    pubBanter:"You've been asked to stop quoting the dress code by paragraph number.",
    cmd:'Elesh Norn, Grand Cenobite',
    cmdDesc:'Your other creatures get +2/+2, and your opponents\' creatures get -2/-2.',
    you:["You give your own family the same answer you'd give a stranger.","When you take on a queue-jumper, whoever is with you suddenly needs to check their phone.","Visitors to your house hear the rules before they're offered a drink."],
    str:["Will hold a team together past the point most people would have given up.","Has turned down a promotion that came with a favour attached.","Gets asked by new starters, because they'll get the same answer as everyone else.","Makes decisions in the open, where they can't be called a stitch-up."],
    weak:["Will enforce a rule for years after the reason for it has gone.","Looks for the perfectly fair answer in situations that don't have one.","Is caught out, every time, by the colleague who thinks the rules are for other people.","Notices the world has changed some time after it did."],
    roles:'HR Leadership, Compliance, Audit, Ethics, Community Management'
  },
  'MONO-U':{
    name:'MONO-BLUE',
    tag:'Perfection Through Knowledge',
    colors:['U'],
    philosophy:"You won't buy a kettle until you've read forty reviews of it. Mostly that's because you hate being wrong in front of people.",
    desc:"You're the person who reads the documentation, then re-reads the bit everyone else skipped. In meetings, the loud people often end up asking you for the answer.",
    pubBanter:"You once answered 'any questions?' with a numbered list.",
    cmd:'Urza, Lord High Artificer',
    cmdDesc:'Urza lets you tap your artifacts for blue mana. For five mana, you shuffle your library and exile the top card, which you may play free until end of turn.',
    you:["You like to understand a thing before you act, which is sensible, and to understand it completely, which is where the trouble starts.","You're nearly always right — nearly always a little too late to be any use.","People come to you upset and go away informed."],
    str:["Reads the footnotes in the appendix.","Finds the assumption nobody questioned and questions it, gently.","Builds the model the rest of the team ends up borrowing.","Updates their position when the evidence updates, without making a thing of it."],
    weak:["Will spend a week optimising the decision that needed an afternoon.","Mistakes 'I can see how you might feel that' for an adequate emotional response.","Considers fifteen edge cases before lunch and has not yet addressed the main one.","Marks other people's arguments out of ten, without being asked."],
    roles:'Strategy, Research, Analytics, Architecture, Policy Analysis, Forecasting'
  },
  'MONO-B':{
    name:'MONO-BLACK',
    tag:'Ambition Without Apology',
    colors:['B'],
    philosophy:"You look after your own interests and assume other people are doing the same. You want the final say on things, because otherwise somebody else gets it.",
    desc:"People around you are often still catching up with a situation you've already read and acted on.",
    pubBanter:"",
    cmd:"K'rrik, Son of Yawgmoth",
    cmdDesc:'K\'rrik lets you pay 2 life instead of black mana, and lifelink heals some of it back.',
    you:["You ask for a discount in shops that don't do discounts.","If someone says they like your coat, you spend the evening working out what they want.","Anyone who owes you knows exactly how much, interest included."],
    str:["Asks for the pay rise the week they've earned it.","Knows what each person in a negotiation needs to walk away with.","Makes the unpopular call on a Friday afternoon and sleeps fine that night."],
    weak:["Is thrown by colleagues who aren't keeping score.","Trades away a colleague's project to win a bigger argument, and is surprised when they take it personally.","Finds it hard to believe a compliment comes with nothing attached."],
    roles:'Executive Leadership, M&A, Private Equity, Turnarounds, Restructuring, Corporate Strategy'
  },
  'MONO-R':{
    name:'MONO-RED',
    tag:'Freedom Through Action',
    colors:['R'],
    philosophy:"If something feels right you do it today and sort out the details afterwards. Waiting makes you miserable, and the details have never once been as bad as people said.",
    desc:"Your gut is sometimes wrong, but acting on it fast usually makes up for that.",
    pubBanter:"You've replied to the email before the attachment finished downloading.",
    cmd:'Krenko, Mob Boss',
    cmdDesc:'Krenko taps to make a 1/1 Goblin for every Goblin you already control.',
    you:["You throw yourself into things completely, for about three weeks.","People love the idea you have at midnight and spend the next fortnight carrying it out.","You say what you feel the second you feel it. A week later you feel something else, and you say that too."],
    str:["Turns 'someone should do something' into doing it.","Says what they think straight away, before they've had time to soften it.","Can talk a tired team into one more go."],
    weak:["Reads three sentences of the brief and assumes the rest.","Has restarted a slow project from scratch because waiting was boring.","Runs at full output for six weeks, then is unreachable for a fortnight."],
    roles:'Startups, Sales, Crisis Response, Creative Industries, Frontline Operations, Live Events'
  },
  'MONO-G':{
    name:'MONO-GREEN',
    tag:'Growth Through Acceptance',
    colors:['G'],
    philosophy:"If a thing has worked for twenty years, you see no reason to touch it. You've seen plenty of improvements, and most of them needed replacing before the old thing would have.",
    desc:"You trust proven patterns. Updating one takes you a while, but you'll do it when you have to.",
    pubBanter:"",
    cmd:'Omnath, Locus of Mana',
    cmdDesc:"Omnath doesn't lose green mana as steps and phases end, and grows +1/+1 for each unspent green mana you have.",
    you:["You leave problems alone to sort themselves out. Some of them have been sorting themselves out since the last government.","Your school friends say you haven't changed a bit, which they mean both ways.","New ideas interest you in the way weather in another country does."],
    str:["Has been with the company nine years and remembers, without checking, why that policy exists.","Knows the difference between a thing that is broken and a thing that is healing, and will let the second one finish.","Builds processes the way other people build sheds, for weather they have personally seen."],
    weak:["Has politely outlasted three reorgs and the people who proposed them.","Treats every new suggestion as an interesting thing happening to other people.","Will let a problem deepen on the theory that it might resolve itself."],
    roles:"Farming, Conservation, Facilities, Estate Management, Mentoring"
  },
  'AZORIUS':{
    name:'AZORIUS',
    tag:'Order Through Knowledge',
    colors:['W','U'],
    philosophy:"You want the rules written down and the same for everyone. You'll wait an extra month for a decision made properly, partly because you'll be the one quoting it afterwards.",
    desc:"You build the process and make sure it applies to everyone equally. Written down properly, it keeps working after you've moved on.",
    pubBanter:"",
    cmd:'Grand Arbiter Augustin IV',
    cmdDesc:"Your white and blue spells cost one mana less, and your opponents' spells cost one mana more.",
    you:["You think most rows could be avoided with a decent system, so your household now has a complaints procedure.","When the bill comes, you work out who had what.","If the boiler breaks, you read the warranty before you look at the boiler."],
    str:["Designs the process that stops last year's disaster from happening again.","Documents the decision and the dissent.","Builds systems where the wrong answer is hard to reach, even on purpose."],
    weak:["Can't start a piece of work until it has a reference number.","Will apply the letter of a rule in an emergency it was never written for.","Confuses 'the rule has been followed' with 'the problem has been solved'."],
    roles:'COO, Compliance, Strategic Planning, Governance, General Counsel, Risk Management'
  },
  'SELESNYA':{
    name:'SELESNYA',
    tag:'Together, Slowly',
    colors:['W','G'],
    philosophy:"You won't book a table for eight until all eight have said yes. You like being the one nobody's cross with.",
    desc:"You notice who is struggling before they say anything.",
    pubBanter:"You organised a leaving do for someone who was only going on holiday.",
    cmd:"Trostani, Selesnya's Voice",
    cmdDesc:"You gain life equal to the toughness of each other creature that enters under your control. For three mana, one of them green and one white, Trostani taps to copy a creature token you control.",
    you:["At your own parties you end up in the kitchen with whoever looks left out.","It takes you several lunches to tell anyone bad news.","You remember everyone's birthday, and who forgot yours."],
    str:["Remembers the names of everyone's children and which one is having a hard year, and acts on it.","Builds a team that, three years in, still likes each other.","Finds the version of the plan that nobody has to lose for it to work."],
    weak:["Has been rehearsing the same difficult conversation in their head since spring.","Keeps a struggling colleague in a job they can't do, because letting them go feels cruel.","Waits for hard decisions to become gentle ones."],
    roles:'Chief People Officer, HR, Team Leads, Community Programmes, Volunteer Coordination'
  },
  'ORZHOV':{
    name:'ORZHOV',
    tag:'Rules That Pay',
    colors:['W','B'],
    philosophy:"You like a clear pecking order, with everyone knowing who decides what. The people who keep it running should be paid properly for it, and you've noticed that includes you.",
    desc:"You have a rule-builder's patience and a player's eye for advantage. The hierarchies you build serve the organisation and serve you, and you see no conflict between the two.",
    pubBanter:"Your expense claims are immaculate. So is your memory of everyone else's.",
    cmd:'Obzedat, Ghost Council',
    cmdDesc:'When Obzedat enters, an opponent loses 2 life and you gain 2. It can leave at your end step and return at your next upkeep with haste.',
    you:["Interest-free loans from you come with a mention in your speech at the borrower's wedding, along with the amount.","You know how things should be done, and so, shortly, will the host.","The rules you enforce hardest happen to be the ones that suit you, which you put down to judgement."],
    str:["Writes rules that get followed without anyone being chased.","Designs the hierarchy where the right people advance and the merely loud ones politely stall.","Holds the institutional memory, including the parts the institution has been trying to forget.","Can find the budget, and knows who to talk to if there isn't one."],
    weak:["Still mentions the small favour they did a colleague years ago.","Promotes the deserving and the indebted, and people aren't sure which they are.","Applies the policy in full to other teams, and with some discretion to their own."],
    roles:"COO, Finance, Law, Private Banking, Estate Planning, Senior Management, Institutional Investing"
  },
  'DIMIR':{
    name:'DIMIR',
    tag:'Knowing More Than You Say',
    colors:['U','B'],
    philosophy:"You make a point of knowing more than the people you're talking to. Most of it comes from what they leave out, and you keep it until it's worth something.",
    desc:"Most of the time you know what everyone around you is after, but you rarely let on.",
    pubBanter:"You know who's leaving before their manager does.",
    cmd:"Yuriko, the Tiger's Shadow",
    cmdDesc:'Yuriko swaps in for an unblocked attacker. When your Ninjas hit a player, you reveal your top card and put it in your hand. Each opponent loses life equal to its mana value.',
    you:["You're a closed book with very good hearing.","Half of what you know, people told you without meaning to.","You answer every straight question truthfully, just rarely the one that was asked."],
    str:["Has spotted three of the last five problems first.","Can tell from a seating plan who has fallen out with whom.","Adapts faster when the rules change, because they were watching for that already."],
    weak:["Gathers information faster than they can turn it into results.","Has been told they're hard to read, and took it as a compliment.","Finds it hard to be trusted quickly, because nobody has ever seen their whole hand.","Carries everyone's secrets and pretends it isn't exhausting."],
    roles:'Strategic Planning, M&A, Competitive Intelligence, VC/PE, Investigative Journalism'
  },
  'IZZET':{
    name:'IZZET',
    tag:'Discovery Through Experimentation',
    colors:['U','R'],
    philosophy:"When you get an idea, you build a rough version of it that week. Most of what you know came from the ones that broke, and you don't mind, because they were interesting.",
    desc:"You're curious about how things work and impatient to test your ideas on something real.",
    pubBanter:"You tested it on the live system again and called the outage 'interesting data'.",
    cmd:'Niv-Mizzet, Parun',
    cmdDesc:'Can\'t be countered. Whenever you draw a card, deal 1 damage to any target. Whenever a player casts an instant or sorcery spell, you draw a card.',
    you:["You'll solve any problem brilliantly, sometimes even the one people had.","Your best idea of the week arrives at one in the morning. So does the message telling someone about it.","Once you've got something working, it goes in a drawer."],
    str:["Will try the thing that probably won't work, on the chance it does.","Leaves a twenty-minute meeting with four ideas worth testing.","Will rebuild a system at 11pm because they thought of a better way at 10:47pm.","Knows the spec well enough to find the bit where the spec is lying."],
    weak:["Has three projects on the go. One of them is on fire.","Loses interest exactly when the idea has to become a thing anyone else can use.","Keeps the documentation in their head.","Underestimates how much other people value something that works, however badly.","Will solve the wrong problem brilliantly."],
    roles:'R&D, Product Development, Startups, Quant Research'
  },
  'GRUUL':{
    name:'GRUUL',
    tag:'Power Through Instinct',
    colors:['R','G'],
    philosophy:"Most new ways of doing things are the old way with a login. You go with your gut and what worked last time, and you're right often enough to keep doing it.",
    desc:"When a plan stops working, you're the one the team sends in. You fix it with methods you already trust, often before anyone has agreed a new plan.",
    pubBanter:"You've never read a manual. The flat-pack wardrobe is somehow still standing.",
    cmd:'Borborygmos Enraged',
    cmdDesc:'Whenever Borborygmos deals combat damage to a player, reveal the top three cards: lands go to your hand, the rest to your graveyard. Discard a land card: 3 damage to any target.',
    you:["Five minutes after losing your temper, you've forgotten all about it.","Thank-yous tend to miss you, because by the time anyone thinks of one you've already gone.","You make up your mind about people on the spot, and it takes them years to change it."],
    str:["Calls for a decision when the discussion starts going round in circles.","Will not pretend the meeting was useful when it wasn't.","Knows when the answer is 'just do it' and is correct more often than is comfortable.","Does the job and is gone before the thank-you email goes round."],
    weak:["Has called a fire drill 'process for the sake of process'.","Treats nuance as someone else's job, which works until they're on their own.","Deals with things quickly, and only sometimes well."],
    roles:"Emergency Services, Sport, Field Engineering, Sales, Operations"
  },
  'RAKDOS':{
    name:'RAKDOS',
    tag:'Freedom Through Chaos',
    colors:['B','R'],
    philosophy:"You treat most rules as someone else's attempt to stop your evening. If you want something you go and get it, and the bill, whatever it is, is yours.",
    desc:"Nobody has to guess what you want, because you go after it openly. You also do what you say you'll do.",
    pubBanter:"You've been banned from organising the Christmas party, twice.",
    cmd:'Rakdos, Lord of Riots',
    cmdDesc:'You can cast Rakdos only after an opponent has lost life this turn. Your creature spells then cost one mana less for each life your opponents have lost this turn.',
    you:["You always do what you say you'll do, even the things you only said for a laugh.","At funerals, someone has to keep an eye on you.","You tell a great story about your worst nights out, and some of the people in them have asked you to stop."],
    str:["Livens up a training day that was dying on its feet.","Will say what everyone was thinking but nobody planned to say.","Can turn a disastrous launch into a story people want to hear.","Treats company-line phrases with suspicion."],
    weak:["Has been described as 'lots of fun' and 'the reason two people left' in the same review.","Will undermine an institution they need, on principle, then be surprised it's gone.","Makes jokes at moments that needed someone to be serious."],
    roles:'Entertainment, Live Music, Nightlife, Activism, Creative Direction'
  },
  'GOLGARI':{
    name:'GOLGARI',
    tag:'Growth Through Decay',
    colors:['B','G'],
    philosophy:"When something has had its day, you keep whatever's still useful and let the rest go. You do your best shopping at house clearances, and you've no objection to people doing the same at yours.",
    desc:"You're patient and clear about your own interests. When a project dies, you keep whatever is still useful from it. People come to you after a failure, or when they want to understand the long game.",
    pubBanter:"",
    cmd:'Meren of Clan Nel Toth',
    cmdDesc:"Each time another of your creatures dies, you get an experience counter. At your end step, you choose a creature card in your graveyard. It returns to the battlefield if its mana value is no more than your experience counters, and to your hand if not.",
    you:["You can tell a couple are finished months before they can, and you've usually worked out who's keeping the dog.","Bad news doesn't upset you much, which upsets people.","Most disasters you've seen before, so you can tell people how long theirs will last."],
    str:["Can tell a project is dying months before the people running it can.","Will keep failing initiatives on life support exactly long enough to harvest the useful bits.","Has seen this crisis before and knows roughly when it ends."],
    weak:["Lets a sinking plan run its course, even when a word in the right ear might have saved it.","Has a folder labelled 'might be useful in three years' that contains everything from the last five years.","Offers 'something new will grow out of this' where a plan should be."],
    roles:"Conservation, Turnarounds, Archives, Insolvency Practice"
  },
  'SIMIC':{
    name:'SIMIC',
    tag:'Evolution Through Design',
    colors:['G','U'],
    philosophy:"You fix things in small pieces and test each one before you touch the next. It's slower than starting again, but it means the fiddling never has to stop.",
    desc:"You improve things a little at a time, and on purpose.",
    pubBanter:"You've been improving the coffee rota for two years, and it is now the best coffee rota in the building.",
    cmd:'Prime Speaker Vannifar',
    cmdDesc:'Tap Vannifar and sacrifice another creature: search for a creature with mana value exactly 1 more, and put it onto the battlefield.',
    you:["If a thing could be made slightly better, you can't leave it alone, even when it's in someone else's kitchen and they're standing in it.","Your jobs round the house are always nearly finished.","Each change you make is too small for anyone to mind, which is how nobody can find the scissors."],
    str:["Builds the version they wanted, two iterations after the version everyone settled for.","Spots the one small change that will save the team an hour a week.","Reworks an inherited process a little every month until the original is forgotten."],
    weak:["Won't ship anything that is one paragraph short in its documentation.","Polishes parts that were never the bottleneck.","Holds the team to a standard nobody else can see."],
    roles:'Product Management, Process Improvement, Biotech, UX Research, Platform Engineering'
  },
  'BOROS':{
    name:'BOROS',
    tag:'Justice Through Action',
    colors:['R','W'],
    philosophy:"You step in the moment something's wrong, at full volume. Somebody has to, and you don't trust anyone else to do it properly.",
    desc:"A loyal team usually follows you, because you're quick to act on what you believe.",
    pubBanter:"You've used the phrase 'hill to die on' about the stationery order.",
    cmd:'Aurelia, the Warleader',
    cmdDesc:'Whenever Aurelia attacks for the first time each turn, untap all your creatures and gain an additional combat phase.',
    you:["You'll stand up for anyone who's been wronged, including a few people who were fine about it until you got involved.","The council knows your handwriting.","When a parcel goes missing, you want a name."],
    str:["Can get a whole team angry about the right thing.","Says 'that's not fair' to the face of the person responsible.","Gets the first phone call when something has gone badly wrong."],
    weak:["Treats 'let's just send an email' as a form of moral cowardice.","Hears a polite request for more detail as the start of a fight.","Sorts new colleagues into allies and obstacles by the end of their first week."],
    roles:"Campaigning, Trade Unions, Law Enforcement, Crisis Management, Military"
  },
  'BANT':{
    name:'BANT',
    tag:'Harmony Through Structure',
    colors:['W','U','G'],
    philosophy:"You make sure both sides of a row get to finish their sentences. It takes longer, and you don't mind, because the quick answer usually gets argued about again in March.",
    desc:"You run the meetings where everyone gets heard and the decision still holds five years later.",
    pubBanter:"You asked for everyone's views on the lunch order, including the people on holiday.",
    cmd:'Rafiq of the Many',
    cmdDesc:'Whenever a creature you control attacks alone, it gets +1/+1 (exalted) and double strike.',
    you:["Every decision you make still makes sense five years later, which is roughly when it gets made.","Two friends who've fallen out will sooner or later find themselves at dinner at yours, sat next to each other.","If you're put on the spot, you ring round first."],
    str:['Asks the quietest person in the room first, and changes the plan when they\'re right.','Keeps the working behind every decision, so it still makes sense five years later.','Can tell a slow decision from a stuck one, and waits out the first.','Leaves a team in better shape than they found it, which takes about four years.'],
    weak:["Struggles when there's no time to consult anyone.","Takes 'everyone agreed' as proof that the plan is going to work.","Gives every disagreement one more meeting."],
    roles:'Executive Leadership in slow-growth sectors, Strategic HR, Educational Leadership, Policy Development, Mediation, Public Service'
  },
  'ESPER':{
    name:'ESPER',
    tag:'Perfection Through Control',
    colors:['W','U','B'],
    philosophy:"You do all the thinking first, then make the decision on your own. People are welcome to disagree with it afterwards.",
    desc:"You're rarely the warmest person in the room. Your decisions are often still holding up after six months of pressure, and people learn to rely on them.",
    pubBanter:"Your out-of-office has an escalation path.",
    cmd:'Sharuum the Hegemon',
    cmdDesc:'When Sharuum enters, you may return an artifact card from your graveyard to the battlefield.',
    you:["Every invitation you send has a finish time on it.","You leave nothing to chance, and very little to anyone else.","Things run smoothly when you're in charge, which is always."],
    str:["Has read the whole budget, including the bits marked 'other'.","Sets things up so the right answer is also the easiest one to reach.","Knows which form to fill in, and which committee to skip.","Can say exactly what a decision will cost, and makes it anyway."],
    weak:["Finds the best answer on paper, and is the last to hear that the people it affects are upset.","Freezes when a crisis arrives before the information does.","Answers a heartfelt complaint with a revised procedure."],
    roles:"CFO/Finance, Chief Compliance Officer, Auditing, Actuarial Work, Intelligence Analysis, Public Policy"
  },
  'GRIXIS':{
    name:'GRIXIS',
    tag:"Power Through Pressure",
    colors:['U','B','R'],
    philosophy:"You think faster and push harder than most people, so you usually leave with what you came for. You'd like to be liked as well, but it's a distant second.",
    desc:"You read a situation faster than most and act on it straight away.",
    pubBanter:"",
    cmd:'Nekusar, the Mindrazer',
    cmdDesc:'Every player draws an extra card in their draw step, and whenever an opponent draws, Nekusar deals them 1 damage.',
    you:["At a dinner party you win every argument and call it a good evening.","The last man who sold you a car needed a sit-down afterwards.","You'll apologise for your tone by explaining why you were right."],
    str:["Gets a lot done with very few people.","Is happy to name the cost out loud and to pay it.","Opens a negotiation already knowing the other side's lowest price."],
    weak:["Has used \"it's just business\" to describe something that was, by any honest reading, slightly personal.","Spends goodwill in the same week they earn it.","Replies to a complaint about their tone with the sales figures."],
    roles:'Turnaround CEO, Competitive Strategy, High-Stakes Trading, Private Equity'
  },
  'JUND':{
    name:'JUND',
    tag:'Survival Through Hunger',
    colors:['B','R','G'],
    philosophy:"You'll walk away from a business or a friendship the week it stops paying its way. You hate losing, and you see no point in doing it slowly.",
    desc:"You're at your best when a competitor shows up and there's something to fight for.",
    pubBanter:"",
    cmd:'Prossh, Skyraider of Kher',
    cmdDesc:'When you cast Prossh, create X 0/1 Kobolds where X is the mana spent. Sacrifice another creature: Prossh gets +1/+0 until end of turn.',
    you:["You play to win, including against children, who you feel should learn.","Nobody keeps up with you for long. You assume they've stopped trying.","You hear 'that can't be done' as a personal challenge, and you've won some very stupid bets."],
    str:["Finishes the project everyone else was avoiding.",'Treats "this is hard" as a description and carries on.',"Will set a target nobody believes in, then hit it, partly out of spite.","Has been through two rounds of layoffs and is still here."],
    weak:["Has never played a friendly game of anything.","Built a pace the rest of the team can't hold, and can't see why.","Hears nuance as hesitation."],
    roles:'Sales, Startups, Professional Sport, Commodity Trading'
  },
  'NAYA':{
    name:'NAYA',
    tag:'Everybody In',
    colors:['R','G','W'],
    philosophy:"You think twenty people who care about the same thing can do almost anything. You find your twenty and ask a lot of them, mostly because you can't stand doing things on your own.",
    desc:"People work harder on a plan you're behind, and believe in it more.",
    pubBanter:"",
    cmd:'Samut, Voice of Dissent',
    cmdDesc:"Samut has double strike and gives your other creatures haste. Tap Samut and pay one white mana to untap another creature, so it can act again.",
    you:["You can get a whole street out for a litter pick, though the street would quite like a weekend off.","Sarcasm doesn't work on you, because you assume everyone means it.","Your group holidays have a timetable and a team name."],
    str:["Can lift people who have stopped believing in their own project.","Knows everyone and has had drinks with everyone.","Is completely sincere, and other people's irony bounces off them."],
    weak:["Wants a group cheer at the end of a long call.","Assumes the fairest idea will win the argument on its own.","Is so enthusiastic that quieter colleagues can't get a word in."],
    roles:'Startups, Marketing, Politics, Sales, Event Planning, Community Building'
  },
  'ABZAN':{
    name:'ABZAN',
    tag:'Endurance Through Tradition',
    colors:['W','B','G'],
    philosophy:"You'll put thirty years into something if it's going to outlast you. Anything that won't matter in ten years gets cut, and you'd like your name on what's left.",
    desc:"You build things to last, and you remember who helped and who didn't.",
    pubBanter:"You still call it 'the new building'. Nobody else in it remembers the old one.",
    cmd:'Karador, Ghost Chieftain',
    cmdDesc:'Karador costs one mana less for each creature card in your graveyard. Once during each of your turns, you may cast a creature from your graveyard.',
    you:["Twenty years on, anyone who helped you out can still ask you for a lift to the airport.","Once someone crosses you, you're civil to them at weddings and nowhere else.","You can explain why any new idea won't work, and you're right about a third of the time."],
    str:["Has seen off four chief executives and one merger.","Knows which colleagues will still answer the phone in a bad year.","Keeps promises made by people who left years ago."],
    weak:["Has patiently explained why each new system won't work, and has been right twice and wrong four times.","Keeps a five-year-old pilot programme in pilot.","Can hold a grudge for longer than most people stay in a job."],
    roles:"Family Businesses, Local Government, Farming, Politics"
  },
  'JESKAI':{
    name:'JESKAI',
    tag:'Excellence Through Discipline',
    colors:['U','R','W'],
    philosophy:"You think most of being good at anything is the hours, and you put them in. You keep count, and anyone who asks how you got so good gets the number.",
    desc:"Years of practice have made you very good at several things. If someone asks how, you'll explain the method step by step.",
    pubBanter:"You brought a laminated agenda to the pub quiz.",
    cmd:'Narset, Enlightened Master',
    cmdDesc:'Whenever Narset attacks, exile the top four cards of your library. Until end of turn, you may cast the noncreature spells among them for free.',
    you:["You only ever hand things over when they're right. Whoever is waiting has learned to bring a book.","Beginners you teach start on the advanced version, for their own good.","On a lie-in you set the alarm for half eight."],
    str:["Practises a presentation the way other people practise an instrument.","Fixes the ethical problem in a plan before it ships, without a fuss.","Notices when a skill has gone rusty, their own included."],
    weak:["Forgets the basics had to be learned, and starts beginners on the advanced version.","Will redo the work that was already correct because it could have been more correct.","Mentors well, but only people whose questions they find interesting."],
    roles:'Teaching, Coaching, Consulting, Classical Music, Martial Arts'
  },
  'SULTAI':{
    name:'SULTAI',
    tag:'The Long Game',
    colors:['B','G','U'],
    philosophy:"You get in early, then let a few years do the work. It's the cheapest way to win that you know of.",
    desc:"You keep a patient, careful record of who holds what.",
    pubBanter:"You've been waiting for the corner office since before it was built.",
    cmd:'Sidisi, Brood Tyrant',
    cmdDesc:'When Sidisi enters or attacks, mill 3. Whenever creature cards hit your graveyard from your library, create a 2/2 Zombie.',
    you:["You wait for a friend to buy the new phone and tell you what's wrong with it.","Nobody quite remembers inviting you, but there you always are.","Good ideas have a habit of ending up working for you, and the people who had them never quite see how."],
    str:["Plays a two-year game in which nothing seems to happen for eighteen months.","Was already in the right meeting before anyone knew which meeting was going to be the right one.","Can sit through a long silence on the phone without filling it."],
    weak:["Needs to be in every conversation that matters, or have someone there.","Has let a good chance pass while waiting for a better one.","Plans so far ahead that colleagues stop asking what the plan is."],
    roles:'Property, Investment, Diplomacy, Wine Making, Corporate Development'
  },
  'MARDU':{
    name:'MARDU',
    tag:'Victory Through Sacrifice',
    colors:['R','W','B'],
    philosophy:"You decide quickly and give everyone a job, then you go first. Not everyone can keep up, and you've accepted that more easily than they have.",
    desc:"The team moves at your speed, and anyone who can't keep up gets left behind.",
    pubBanter:"",
    cmd:'Alesha, Who Smiles at Death',
    cmdDesc:"Whenever Alesha attacks, you may pay two mana, each white or black. If you do, a creature card with power 2 or less returns from your graveyard to the battlefield, tapped and attacking.",
    you:["On family walks you're out in front, about a mile ahead of everyone else.","You tell the story of moving house as a triumph, and it was, for everyone who didn't put their back out.","For any job going, you volunteer someone else."],
    str:["Makes the call and doesn't reopen it a week later.","Knows who needs to be told what, and in which order.","Has hit deadlines that the client had already written off.","Is still holding the line when others are looking for a way out."],
    weak:["Reports the win and leaves out what it cost.","Only slows down between Christmas and the second of January.","Approves holiday requests in principle.","Looks round at the launch party and is briefly surprised by how few of the original team are left."],
    roles:'Turnarounds, Crisis Management, Sales, Founding Teams, Film Production'
  },
  'TEMUR':{
    name:'TEMUR',
    tag:'Whatever Works',
    colors:['G','U','R'],
    philosophy:"You use whatever works on the problem in front of you, and drop it the day it stops working. Anything done the same way twice bores you, which is most of the reason.",
    desc:"You change your approach as the situation shifts, usually sooner than the people around you.",
    pubBanter:"You went out for a sandwich and came back with a business idea and no sandwich.",
    cmd:'Surrak Dragonclaw',
    cmdDesc:"Neither Surrak nor your creatures can be countered, and your other creatures have trample.",
    you:["You lose interest in a hobby about the time you get good at it.","Your friends write your address in pencil.","Nothing throws you when a plan falls apart, which the people who made the plan find hard to forgive."],
    str:["Learns a new tool in a weekend and teaches it on Monday.","Has a new idea most mornings. Some of them are good.","Stays calm when the plan falls apart, having expected it to.","Will try the thing nobody got permission to try."],
    weak:["Has been on the same project for six weeks and rewritten the foundations twice.","Is enrolled on four online courses and has finished one.","Has taught the team not to plan beyond the end of the month."],
    roles:"Startups, Research, Product Design, Journalism, Expedition Leading"
  },
  'WITCH':{
    name:'FOUR-COLOUR (No Red)',
    tag:'Perfection Without Haste',
    colors:['W','U','B','G'],
    philosophy:"You take your time over every decision, and most of them still look right ten years on. Hurrying costs money, and you hate spending it.",
    desc:"You're the person whose plans are still working in three years. You take urgent requests calmly and decide whether they need any action at all.",
    pubBanter:"You asked whether your surprise party had come out of the contingency budget.",
    cmd:"Atraxa, Praetors' Voice",
    cmdDesc:'At your end step, proliferate: give each permanent and player you choose another of each kind of counter already on it.',
    you:["With the bus already at the stop, you walk at the same speed.","Other people's emergencies get a fair hearing from you, and then a slot next week.","In the middle of a row, you can quote back exactly what was said, and when."],
    str:["Wins long arguments by turning up to every meeting until the other side stops coming.","Is in year six of a ten-year plan.","Can take minutes during a shouting match, and get them right."],
    weak:["Has been called cold, mostly by people who were panicking at the time.",'Calls a passionate idea "inefficient" before finding out what the passion was for.',"Has more than once watched a crisis unfold and analysed it correctly without doing anything."],
    roles:'Operations, Finance, Strategy, Long-term Planning, Sovereign Wealth, Patient Capital'
  },
  'YORE':{
    name:'FOUR-COLOUR (No Green)',
    tag:"Innovation Without Nostalgia",
    colors:['W','U','B','R'],
    philosophy:"You look at most things and see the version you'd build next. You read up on the old way, then build a new one with people sharp enough to argue, mainly so you can beat them.",
    desc:"You build complex systems and rebuild any part that doesn't quite fit, including parts that still work.",
    pubBanter:"You wrote a script to book a meeting room, and it now books all of them.",
    cmd:'Breya, Etherium Shaper',
    cmdDesc:"When Breya enters, you get two 1/1 flying Thopters. Pay two mana and sacrifice two artifacts, and Breya can deal 3 damage to a player or give you 5 life.",
    you:["You can't leave anything as it is, and the people who liked it as it was have stopped mentioning it.","Whenever a form asks for any other comments, you have some.","If someone wants a shelf put up, you build them a storage system."],
    str:["Can hold a whole system in their head and change it while it's running.","Spots the one weak link in a design before it goes live.","Will work late because the work isn't right yet.","Automates any job they've had to do twice."],
    weak:["Turns the shopping list into a system.","Distrusts any solution short enough to fit on one slide.","Works at a pace their own body has started to complain about."],
    roles:'Tech Startups, Engineering Leadership, Systems Architecture, R&D, Founders'
  },
  'GLINT':{
    name:'FOUR-COLOUR (No White)',
    tag:'Power Without Permission',
    colors:['U','B','R','G'],
    philosophy:"You get the thing done and let other people worry about how it looked. If a rule only protects whoever wrote it, you go round it without losing any sleep.",
    desc:"You have no strong loyalty to the group, so the lines other people stay inside don't hold you.",
    pubBanter:"",
    cmd:'Yidris, Maelstrom Wielder',
    cmdDesc:'When Yidris deals combat damage to a player, the spells you cast from your hand that turn gain cascade.',
    you:["You read 'staff only' as a suggestion.","Until it's settled, nobody can say which side you're on, you included.","People bring you the impossible jobs and keep the ordinary ones well away from you."],
    str:["Can work with anyone, including people the rest of the team won't speak to.","Gets the answer from the person who isn't supposed to give it.","Will tear down a system two people built their reputations on, once it stops working."],
    weak:["Treats \"is this okay?\" as a question for someone else's department.","Makes commitments in good faith and drops them when the situation changes.","Is first choice for the impossible job and last for the routine one."],
    roles:"Venture Capital, Trading, Startups, Activist Investing, Distressed Asset Acquisition"
  },
  'DUNE':{
    name:'FOUR-COLOUR (No Blue)',
    tag:'Action Before Analysis',
    colors:['W','B','R','G'],
    philosophy:"You do the thing and learn from what happens. A lot of planning looks to you like people scared of being wrong, so you make a start and fix things as you go.",
    desc:"You commit on instinct and figure things out in motion, skipping the analysis that would slow you down.",
    pubBanter:"",
    cmd:'Saskia the Unyielding',
    cmdDesc:'As Saskia enters, choose a player. Whenever your creatures deal combat damage to a player, they deal the same damage to the chosen player.',
    you:["You start painting a room before you've bought enough paint.","Wherever you go, people follow, which has led some of them to very odd places.","Your gut has a lot to answer for."],
    str:["Gets a stalled decision made in a single phone call.","Notices when the team has gone quiet in the wrong way.","Has people who will follow them into the next project before they've heard what it is."],
    weak:["Has shipped the thing on Tuesday and is fixing the thing on Wednesday.","Doesn't trust an answer that needed a spreadsheet.","Hears 'let's sleep on it' as 'let's not'."],
    roles:"Sales, Crisis Response, Live Events, Field Operations, Military"
  },
  'INK':{
    name:'FOUR-COLOUR (No Black)',
    tag:'Altruism Without an Angle',
    colors:['W','U','R','G'],
    philosophy:"You'll work hard for anything that helps somebody else, and you won't use people to get ahead. That's the one thing you allow yourself to be vain about.",
    desc:"You help people and build things that serve others, and what's in it for you rarely comes up.",
    pubBanter:"You told the recruiter your salary expectations were 'whatever is fair'.",
    cmd:'Kynaios and Tiro of Meletis',
    cmdDesc:'At the beginning of your end step, you draw a card. Each player may then put a land onto the battlefield from their hand, and each opponent who didn\'t draws a card.',
    you:["You give everyone the benefit of the doubt, which a few of them have been living on for years.","Somebody who loves you has to say no on your behalf, usually while you're still saying yes.","Things you did on your own, you call a team effort."],
    str:["Makes cynical colleagues a little less cynical.","Knows the night security guard's name, and the name of his dog.","Asks who a project is for, then checks it works for them."],
    weak:["Extends the benefit of the doubt to people who used theirs up long ago.","Has a diary full of other people's good causes.","Gives the credit away so often that their manager has lost track of what they did."],
    roles:'Nonprofits, Education, Community Building, Social Enterprise, Cooperative Movement, Public Health'
  },
  'WUBRG':{
    name:'FIVE-COLOUR',
    tag:'All of the Above',
    colors:['W','U','B','R','G'],
    philosophy:"You size up a situation first and then become whoever it needs. You're the sensible one or the loud one, depending on who else turns up.",
    desc:"You can draw on every approach, which makes you either a Renaissance person or a generalist who hasn't picked one yet.",
    pubBanter:"",
    cmd:'Kenrith, the Returned King',
    cmdDesc:'Kenrith has an ability in each of the five colours, from giving every creature haste to bringing one back from a graveyard.',
    you:["You can see every side of an argument, and you've been asked more than once to pick one.","By the end of a phone call you've caught the other person's accent.","You know what everyone thinks, apart from you."],
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
