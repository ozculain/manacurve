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
      'MONO-W': 'Tell everyone where we stand. The extra hours get shared out evenly.',
      'MONO-U': "Stop all work until I know exactly why it's failing.",
      'MONO-B': 'Get to whoever decides what counts as failure before anyone else does.',
      'MONO-R': 'Start this minute.',
      'MONO-G': "Go back to the way we've always done it.",
      'AZORIUS': 'Write one plan, with a named job for each person.',
      'DIMIR': 'Fix it quietly, and tell people only what they need to know.',
      'RAKDOS': 'Bin the plan and do whatever works.',
      'GRUUL': 'Strip it back to the simple version that works.',
      'SELESNYA': "Get everyone into one room and keep an eye on how they're coping.",
      'ORZHOV': "Call in the favours I'm owed, and reward whoever comes through.",
      'IZZET': 'Try three fixes tonight and keep whichever works.',
      'GOLGARI': "This version's had it. I'd build a smaller one from what still works.",
      'BOROS': "Own it publicly, then drive everyone flat out until it's fixed.",
      'SIMIC': "Fix whatever's breaking most first, one tested step at a time.",
      'BANT': 'Check the numbers, then pace the work so nobody burns out.',
      'ESPER': "Take every decision myself until it's done.",
      'GRIXIS': 'Push everyone hard down the fastest route to a result.',
      'JUND': "Cut the weak parts tonight and throw everything at what's left.",
      'NAYA': "I'd be in there with them all night, keeping spirits up.",
      'ABZAN': "Dig in. We've got through worse than this before.",
      'JESKAI': 'Drill one clear plan with everyone until it runs smoothly.',
      'SULTAI': "Save what's worth saving, and note who held up under pressure.",
      'MARDU': 'Put everyone on it tonight, under my orders.',
      'TEMUR': 'Ten minutes to understand it properly. After that, change course as it changes.',
      'WITCH': 'Find out whether the 48 hours is fixed before anyone panics.',
      'GLINT': "Go over everyone's heads to get the deadline moved.",
      'DUNE': 'Forget why it failed. Get everyone fixing things now.',
      'INK': "Make sure nobody's blamed, even if we miss the deadline.",
      'YORE': 'Drop the old approach. The sharpest people start a fresh one tonight.',
      'WUBRG': "Depends what's broken. A late supplier and a bad design need different fixes."
    }
  },
  CONFLICT: {
    id: 'CONFLICT',
    context: "Two people in a group you run are arguing hard over a decision you'll have to answer for.",
    responses: {
      'MONO-W': 'Decide by the rules we agreed, whoever that disappoints.',
      'MONO-U': 'Not until I understand both sides properly.',
      'MONO-B': "My call, and I'd make it today.",
      'MONO-R': 'Have it out in the open, today.',
      'MONO-G': 'Give it a few days to settle.',
      'AZORIUS': 'Write down the criteria first, and judge both cases against them.',
      'DIMIR': 'Talk to each alone, listening for what they leave out.',
      'RAKDOS': 'Back whichever of them wants it more.',
      'GRUUL': 'Go with my gut and tell them straight.',
      'SELESNYA': 'Keep everyone talking until we find something we can all live with.',
      'ORZHOV': 'Let the more senior of the two decide.',
      'IZZET': 'Try both ideas small this week and let the results decide.',
      'GOLGARI': "One idea has to go. I'd keep its best parts for later.",
      'BOROS': "Decide what's right today. Then both of them commit, fully.",
      'SIMIC': 'Combine the two ideas and test the mix.',
      'BANT': 'Take a week to hear both properly, then look for common ground.',
      'ESPER': 'Score both against clear criteria and decide alone.',
      'GRIXIS': 'Have each pitch it to me tomorrow. The stronger case gets the money.',
      'JUND': 'Let them argue it out and back the case that survives.',
      'NAYA': "Remind both what we're here for, then let the whole group decide.",
      'ABZAN': "Stick with what's served us for years, unless the new idea clearly beats it.",
      'JESKAI': "Run it as a proper debate, with each arguing the other's side.",
      'SULTAI': 'Watch both for a week, then back whichever is stronger.',
      'MARDU': 'They get an hour to agree. After that, I decide.',
      'TEMUR': 'Pick whichever idea still works if things go wrong.',
      'WITCH': 'Take the heat out first, then compare both on the facts, slowly.',
      'GLINT': 'Go with whichever idea pays better, and move on.',
      'DUNE': "Pick one and start. We'll know within a week if it's wrong.",
      'INK': 'Find a way forward where neither loses face, however long it takes.',
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
      'MONO-R': 'Yes, today.',
      'MONO-G': "Stay. I've built a good life where I am.",
      'AZORIUS': 'Only with the terms in writing, and a proper handover where I am.',
      'DIMIR': 'Use the offer to get a rise where I am.',
      'RAKDOS': 'Take it and enjoy every minute while it lasts.',
      'GRUUL': "My gut's said yes for years.",
      'SELESNYA': "If they're good people to work with, I'll go.",
      'ORZHOV': "Depends on the title. If it's a step up, I'll take the pay cut.",
      'IZZET': "Try it for a year. I'll learn a lot either way.",
      'GOLGARI': 'My current job has run its course, so yes.',
      'BOROS': "If the work matters, I'm in, all the way.",
      'SIMIC': "Accept, and grow into the parts I can't do yet.",
      'BANT': 'Ask them to wait six months while I save up a cushion.',
      'ESPER': 'Accept on terms I set, with security written in.',
      'GRIXIS': "Take it as a stepping stone. In a few years I'll run my own.",
      'JUND': 'Take it and make myself too good to let go.',
      'NAYA': 'Go for it. My friends will back me if it folds.',
      'ABZAN': "Turn it down. I need something that'll still pay in twenty years.",
      'JESKAI': 'Yes, to get properly good at the craft.',
      'SULTAI': 'Not yet. A better offer will come once the right people know my work.',
      'MARDU': 'Accept today and hand in my notice tomorrow.',
      'TEMUR': 'As long as nobody tells me how to do it, yes.',
      'WITCH': 'Run the numbers calmly. If they work, accept.',
      'GLINT': 'Go if it moves me forward. I owe this place my notice, nothing more.',
      'DUNE': "Say yes and work out the money once I'm in.",
      'INK': "If the work does some good, yes. I'll manage on less.",
      'YORE': 'Take it and rebuild how I work from the ground up.',
      'WUBRG': 'Depends where I am in life. With a mortgage, only with a cushion.'
    }
  },
  MISTAKE: {
    id: 'MISTAKE',
    context: "You've made a serious mistake, and it has cost time and money.",
    responses: {
      'MONO-W': "Give up my evenings until it's put right for everyone it affected.",
      'MONO-U': 'Trace exactly how it happened before anyone touches it.',
      'MONO-B': 'Fix it fast, where the people above me can see it.',
      'MONO-R': 'Put my hand up straight away and start fixing it.',
      'MONO-G': 'Put it right, then let it go.',
      'AZORIUS': 'Report it in writing, with a proposed rule to stop it happening again.',
      'DIMIR': 'Find out who already knows before I decide what to say.',
      'RAKDOS': 'It was me. On to the next thing.',
      'GRUUL': "I broke it, so I'll take the shouting.",
      'SELESNYA': 'Tell the group straight away and ask for their help.',
      'ORZHOV': 'Cover the cost myself, so nobody can hold it over me.',
      'IZZET': 'Try a better fix straight away, using what this one taught me.',
      'GOLGARI': 'Build the next attempt on whatever can be salvaged.',
      'BOROS': 'Take the blame in public and throw myself into putting it right.',
      'SIMIC': 'Change how I work, one small step at a time.',
      'BANT': 'Keep everyone else out of the fallout first. Then fix it properly.',
      'ESPER': 'Tell the whole story myself, with the numbers, before the rumours do.',
      'GRIXIS': 'Fix it fast. Then straight back to taking risks.',
      'JUND': 'Take the hit and keep going.',
      'NAYA': "I'd feel awful, and I'd put all of that into fixing it.",
      'ABZAN': 'Take the telling-off. My record will carry me through it.',
      'JESKAI': "Find exactly where my method slipped, and drill until it can't.",
      'SULTAI': "If it can't be saved, cut my losses early.",
      'MARDU': 'Say who fixes what. We fix it tonight.',
      'TEMUR': 'Change course now, and again if I need to.',
      'WITCH': "Find the cause calmly, and leave the apologies until it's fixed.",
      'GLINT': 'Fix it and move on, without the hand-wringing.',
      'DUNE': 'Skip the inquest. Just tell me what needs doing.',
      'INK': 'Say sorry to everyone it hurt, and make sure nobody else suffers for it.',
      'YORE': 'Redesign the process so the mistake becomes impossible.',
      'WUBRG': 'Size it up, then decide if it needs an apology or a new system.'
    }
  },
  BURNOUT: {
    id: 'BURNOUT',
    context: "You're exhausted, and there's more on your plate than you can carry.",
    responses: {
      'MONO-W': 'Finish my share first. Then ask for a fairer split next time.',
      'MONO-U': "Work out exactly where the time's going before changing anything.",
      'MONO-B': "Drop the work that doesn't get me anywhere, today.",
      'MONO-R': 'Take tomorrow off without asking.',
      'MONO-G': 'Early nights, and an hour in the garden each day.',
      'AZORIUS': 'Put in a formal request for help, and work by deadline until then.',
      'DIMIR': 'Have a private word with whoever can move my deadlines.',
      'RAKDOS': 'Book a week somewhere hot and let the work wait.',
      'GRUUL': 'Cancel the meetings and just do the work.',
      'SELESNYA': "I'd admit I'm struggling and let the group take some of it.",
      'ORZHOV': "Call in a few favours I'm owed.",
      'IZZET': 'Try a different way of working this week.',
      'GOLGARI': 'Let some of it quietly lapse, and see what anyone misses.',
      'BOROS': 'Push through to the end of this, then rest properly.',
      'SIMIC': 'Change one habit a week and keep whatever helps.',
      'BANT': 'Cut the list to a load I could keep up for a year.',
      'ESPER': "Hand off everything I don't need to decide myself.",
      'GRIXIS': 'Give the routine work to others and keep what gets noticed.',
      'JUND': "Keep going. I've always outlasted people when it gets like this.",
      'NAYA': 'Get everyone out for a night. Their energy keeps me going.',
      'ABZAN': "Pace it. We've had worse spells than this.",
      'JESKAI': 'Get my routine back, starting with sleep.',
      'SULTAI': 'Keep the work that will pay off next year, and pace the rest.',
      'MARDU': 'Finish the most important thing at full pace, then rest.',
      'TEMUR': 'A few days alone in the hills, then a new plan.',
      'WITCH': "Plan the next month calmly and turn down anything that doesn't fit.",
      'GLINT': "Renegotiate everything I've agreed to, starting with the biggest.",
      'DUNE': 'Stop thinking about it. A hard run, then straight back in.',
      'INK': 'Stop saying yes to everything, even to people I want to help.',
      'YORE': 'Scrap how I work and design a new system this week.',
      'WUBRG': "Find out first whether it's the hours or the work itself."
    }
  },
  BETRAYAL: {
    id: 'BETRAYAL',
    context: 'Someone you trusted has just passed off your idea as theirs, in front of people who matter to you.',
    responses: {
      'MONO-W': 'Raise it fairly, and push for a way of recording ideas for everyone.',
      'MONO-U': 'First work out why they did it.',
      'MONO-B': 'Make sure everyone who matters knows it was mine by tonight.',
      'MONO-R': 'Call it out there and then, in front of everyone.',
      'MONO-G': "Let it go. It'll come out in time.",
      'AZORIUS': 'Raise it through the proper process, with my drafts and their dates.',
      'DIMIR': 'Say nothing, and quietly let the right people see my earlier drafts.',
      'RAKDOS': 'Take it back loudly on the spot and let them deal with the fallout.',
      'GRUUL': "Say 'That was mine,' and get back to work.",
      'SELESNYA': "Have a quiet word over coffee. I'd rather keep the friend.",
      'ORZHOV': 'Let it pass, on the understanding they back my next proposal.',
      'IZZET': "Fine. My next idea will be better, and I'll build it first.",
      'GOLGARI': 'Let them run with it, and pick up the pieces they drop.',
      'BOROS': "If they'll do it to me, they've done it to others. I'll find out.",
      'SIMIC': 'Trust them a little less from now on.',
      'BANT': 'Wait a week, then raise it with them privately.',
      'ESPER': 'Put the dated original in front of whoever decides.',
      'GRIXIS': "Get my next idea in front of the same people before the week's out.",
      'JUND': 'Beat them on the next one, in public.',
      'NAYA': "Tell my friends what happened. They'll know who to believe.",
      'ABZAN': 'Leave it to my record. People here know my work.',
      'JESKAI': 'Do the next one so well that nobody could mistake whose it is.',
      'SULTAI': 'Note it, and keep my next idea well away from them.',
      'MARDU': "Take it to whoever's in charge today, and settle it before it festers.",
      'TEMUR': 'Next time, present it myself, first.',
      'WITCH': "Work out what the credit's worth. If it's not much, let it go.",
      'GLINT': 'From now on my ideas go straight to the top, with my name on.',
      'DUNE': 'Tell them to their face that I know, then get on with things.',
      'INK': "Maybe they forgot. I'll give them a chance to put it right.",
      'YORE': "Let them have it. I'm already working on what replaces it.",
      'WUBRG': "With a friend, I'd talk it over. With a rival, I'd show my proof."
    }
  },
  ETHICS: {
    id: 'ETHICS',
    context: "You find out your employer is doing something legal but dodgy. It's profitable, and your bonus depends on it.",
    responses: {
      'MONO-W': 'Raise it in writing with the people in charge, bonus or no bonus.',
      'MONO-U': "Read everything first. I want to know exactly what's at stake.",
      'MONO-B': 'Offer to fix it, in return for running that part of the business.',
      'MONO-R': "It feels wrong, so I'd say so, whatever it costs me.",
      'MONO-G': 'Keep my own work honest and trust it to come out in time.',
      'AZORIUS': "Propose a change to the rules so it can't happen again.",
      'DIMIR': 'Keep a careful record of it, in case I need it.',
      'RAKDOS': "Tell the boss to their face that it's dodgy, and see what happens.",
      'GRUUL': "If it stinks, I won't touch it.",
      'SELESNYA': 'Find out who it hurts, and raise it gently with the people around me.',
      'ORZHOV': 'Take it up privately with the people above me, and let them decide.',
      'IZZET': 'Try a cleaner version on a small scale, and show them the results.',
      'GOLGARI': "Leave once the bonus is paid, and take what I've learned elsewhere.",
      'BOROS': "Legal doesn't make it right. I'd fight it, in public if I must.",
      'SIMIC': 'Study why it pays, then find a clean way to get the same result.',
      'BANT': 'Push for a proper review, however long it takes.',
      'ESPER': 'Put a number on the risk, and stop it if it outweighs the profit.',
      'GRIXIS': 'Draft the fix tonight and get it to the top before anyone objects.',
      'JUND': "Make myself the one they can't do without, whatever happens to it.",
      'NAYA': 'Get everyone together and make enough noise that it stops.',
      'ABZAN': "Stop it now. It'll come out eventually, and we'll still be here.",
      'JESKAI': 'Hold my own work to a higher standard, and make the case from there.',
      'SULTAI': 'Learn how it makes its money, and plan a cleaner version of my own.',
      'MARDU': 'Take it to the top today, and push for a decision this week.',
      'TEMUR': "Move to the parts of the business that don't depend on it.",
      'WITCH': "Weigh the legal and money risks calmly, then raise it if they're serious.",
      'GLINT': 'Treat it as a business risk, and line up my next move.',
      'DUNE': 'Hand my notice in tomorrow.',
      'INK': 'Speak up, even if it costs me my job.',
      'YORE': 'Build a better product that makes this one pointless.',
      'WUBRG': "How hard I push depends on who it hurts. I'd find that out first."
    }
  },
  MTG_STALL: {
    id: 'MTG_STALL',
    context: "It's the final game of your store's Commander league, with the title at stake. After 40 minutes, nobody will attack.",
    responses: {
      'MONO-W': 'Protect the player with the smallest board, and say so.',
      'MONO-U': 'Hold my answers and wait for someone else to move first.',
      'MONO-B': 'Offer the player on my left a deal to take out the leader together.',
      'MONO-R': "Attack now. I'd rather lose than sit here another ten minutes.",
      'MONO-G': 'Wait. My deck gets stronger the longer this goes.',
      'AZORIUS': 'Propose an open deal with clear terms, and keep to it.',
      'DIMIR': "Keep passing, and let them guess what I'm holding.",
      'RAKDOS': 'Swing at the biggest threat with everything, and enjoy the mess.',
      'GRUUL': 'Attack with my biggest creature. Keep it simple.',
      'SELESNYA': "Team up with whoever's friendly, and build up together.",
      'ORZHOV': "Offer protection to anyone who'll back me later.",
      'IZZET': 'Cast something odd that changes the board, and see who reacts.',
      'GOLGARI': 'Let my creatures trade off, then bring them back from the graveyard.',
      'BOROS': 'Attack the leader, and call on the others to join me.',
      'SIMIC': 'Grow my creatures a little every turn.',
      'BANT': 'Hold back, then join in when the table turns on the leader.',
      'ESPER': 'Count the turns to my win, and keep the table calm until then.',
      'GRIXIS': "Talk the others into attacking the leader, then finish whoever's left.",
      'JUND': 'Make every combat cost them more than it costs me.',
      'NAYA': 'Get the table laughing, then lead the charge.',
      'ABZAN': 'Sit tight behind my defences, gaining life every turn.',
      'JESKAI': 'Work out the exact turn I can win, and play towards it.',
      'SULTAI': 'Wait, and pick off whoever overcommits first.',
      'MARDU': 'Commit everything in my hand to one big attack this turn.',
      'TEMUR': 'Hold up mana, and flash in a big threat at the end of a turn.',
      'YORE': 'Assemble my artifact combo and win in one turn.',
      'GLINT': 'Make whatever deals get me to the end, and keep my options open.',
      'DUNE': 'Attack before the slower decks find their answers.',
      'INK': 'Give everyone something to get the game moving, even if it costs me.',
      'WITCH': 'Stay quiet, and let them wear each other down.',
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
    philosophy:"You believe the group matters more than any one person, including you. Rules exist to protect the people who can't argue for themselves. Sometimes that means giving up something you wanted, and you've made your peace with that.",
    desc:"You're the person who makes sure the rules apply to everyone and survive whoever wrote them. The group runs better with you in it. Most of the time the group doesn't notice.",
    pubBanter:"You bog down every decision with rule-checking and discussions about process and fairness. Yeah, you're right about the rules, which is annoying in itself. You're generally nice enough not to mention it.",
    cmd:'Elesh Norn, Grand Cenobite',
    cmdDesc:'Elesh Norn pumps your creatures by +2/+2 and shrinks everyone else\'s by -2/-2. The system protects its own and weakens the rest.',
    str:["Will hold a team together past the point most people would have given up.","Has principles, which can be disconcerting in a work context.","Builds systems with fair rules.","Lands on decisions that hold up because the process was visibly fair, even when the answer wasn't anyone's favourite.","Builds things that outlast their author."],
    weak:["Will enforce a rule long after the reason for the rule has quietly moved on.","Approaches grey areas looking for the absolutely fair answer.","Persistently underestimates the existence and value of people who don't believe in the rules.","Adapts slowly. Can be mildly surprised when the world has moved on without them.","Will pick 'fair but slow' over 'fast and unequal' every time, including when speed matters."],
    roles:'HR Leadership, Master of Ceremonies, Compliance, Ethics, Community Management'
  },
  'MONO-U':{
    name:'MONO-BLUE',
    tag:'Perfection Through Knowledge',
    colors:['U'],
    philosophy:"You believe most decisions get better with more information. You read the whole document, sometimes twice. You ask the third question that nobody else thought to ask. You'd rather be the last person to commit than the first one to be wrong.",
    desc:"You're the person who reads the documentation, then re-reads the bit everyone else skipped. In meetings you're rarely the loudest, but you're often the person the loud people end up asking for the answer.",
    pubBanter:"In three weeks you'll come back with a thoroughly argued treatise explaining how you were right all along, and the world will have moved on.",
    cmd:'Urza, Lord High Artificer',
    cmdDesc:'Urza\'s tap-an-artifact-for-blue-mana and impulse-draw activated abilities are both "if I\'m smart enough, the cost goes away" moves.',
    str:["Loves and understands the detail.","Finds the assumption nobody questioned and questions it, gently.","Models the system three layers deeper than the meeting required, which is why everyone ends up using their models.","Updates their position when the evidence updates, without making a thing of it.","Treats being wrong as new information."],
    weak:["Will spend a week optimising the decision that needed an afternoon.","Mistakes 'I can see how you might feel that' for an adequate emotional response.","Considers fifteen edge cases before lunch and has not yet addressed the main one.","Quietly grades the room.","When asked to pick without enough data, freezes."],
    roles:'Strategy, Research, Analytics, Architecture, Policy Analysis, Forecasting'
  },
  'MONO-B':{
    name:'MONO-BLACK',
    tag:'Power Through Agency',
    colors:['B'],
    philosophy:"You believe everyone should be acting in their own interest. You're one of the few who do it effectively. Power is the ability to shape the world.",
    desc:"You see the reality of the situation faster than the people around you. Most of the discomfort in the room is them catching up.",
    pubBanter:"Everything is a calculation about what you get out of it. Look, it's honest, but there isn't a single person in the team who would turn their back on you and not worry about their kidneys.",
    cmd:"K'rrik, Son of Yawgmoth",
    cmdDesc:'K\'rrik lets you pay 2 life instead of black mana, and lifelink heals some of it back. The whole point is to play through the cost faster than anyone else can.',
    str:["Drives towards outcomes that matter to them, and isn't afraid to break things on the way to achieving that.","Understands emotions, but doesn't place people's feelings on a pedestal.","Understands what motivates people and plans around it.","Happy to make calls that few others want to have made.","Ruthless and focused on achieving outcomes and results."],
    weak:["Tends to assume everyone else is also running the numbers. Some of them are running their feelings.","Trust is offered on a thirty-day rolling basis, renewable upon evidence.","Pulls the lever, and is sometimes blind-sided when the people attached to the lever express concern.","Wins quarters in a way that makes the next quarter harder.","Will explain, kindly, that everyone is doing this; they're just doing it on purpose."],
    roles:'Executive Leadership, M&A, Private Equity, Turnarounds, Restructuring, Corporate Strategy'
  },
  'MONO-R':{
    name:'MONO-RED',
    tag:'Freedom Through Action',
    colors:['R'],
    philosophy:"You believe life is too short for hesitation. Authentic action beats the perfect plan. Do it, and let the version of you that exists later sort out the consequences.",
    desc:"You trust your gut. The gut is sometimes wrong, but the speed compensates more often than not.",
    pubBanter:"Please think for one minute before you set something on fire. The sweeping up is getting old. The wall you demolished last month was one we'd been politely knocking on for a year.",
    cmd:'Krenko, Mob Boss',
    cmdDesc:'Krenko taps to make X Goblins where X is the Goblins you already have. The mechanic doubles every turn it works. The whole strategy is to commit early and produce more momentum than anyone can answer.',
    str:["Closes the laptop and does the thing while the others are still scheduling the kickoff to discuss discussing the thing.","Whatever it is, they mean it.","Is effective at getting something done, and helping others get on the \"let's get things done\" band-wagon.","Says things without thinking which are regularly things other people were thinking.","Will run towards the fire. Has probably put out more fires than they started."],
    weak:["Reads three sentences of the brief and assumes the rest.","Can become very frustrated with lack of action and just blow things up because they're bored.","Leaves a low hum of property damage in their wake.","Runs at full output for six weeks, then is unreachable for a fortnight.","Answered the personality test honestly and instinctively."],
    roles:'Startups, Sales, Crisis Response, Creative Industries, Frontline Operations, Live Events'
  },
  'MONO-G':{
    name:'MONO-GREEN',
    tag:'Growth Through Acceptance',
    colors:['G'],
    philosophy:"You believe nature got it right the first time. What works, works. Growth comes from accepting your place in the larger system instead of fighting against it.",
    desc:"You trust proven patterns. Proven patterns occasionally need updating. You can do that; it just sometimes takes a while.",
    pubBanter:"You resist every single change. Your entire argument is 'we've always done it this way.' We have, on three occasions, ignored you. On one of those occasions you were right.",
    cmd:'Omnath, Locus of Mana',
    cmdDesc:"Omnath doesn't lose green mana as steps and phases end, and grows +1/+1 for each unspent green mana you have. The card rewards patience and accumulation.",
    str:["Has been with the company nine years and remembers, without checking, why that policy exists.","Knows the difference between a thing that is broken and a thing that is healing, and will let the second one finish.","Builds processes the way other people build sheds, for weather they have personally seen.","When asked to move quickly, moves at exactly the speed that allows the work to survive being moved.","Is waiting for the correct season."],
    weak:["Has politely outlasted three reorgs and the people who proposed them.","Treats every new suggestion as an interesting thing happening to other people.","Will let a problem deepen on the theory that it might resolve itself.","The transition was discussed in March, and is still being discussed in October.","Capable of describing 1998 in such detail that the meeting forgets what year it currently is."],
    roles:'Operations, Agriculture, Sustainability, Mentorship, Facilities, Estate Management'
  },
  'AZORIUS':{
    name:'AZORIUS',
    tag:'Order Through Knowledge',
    colors:['W','U'],
    philosophy:"You believe good outcomes come from fair rules, applied carefully and consistently. Rules are the structure that lets a group think clearly enough to act together. The cost is that careful collective thinking takes a while, and you think it's worth it.",
    desc:"You build the process and make sure it applies to everyone equally. The system tends to outlast whoever set it up, which is the design intent. It's not exciting and you're rarely thanked.",
    pubBanter:"You cite chapter and verse to veto anything fun. Every trivial decision becomes a working group. Yeah, one time we skipped the working group, the office caught fire. Doesn't mean it was related and doesn't mean you have to bring it up every meeting.",
    cmd:'Grand Arbiter Augustin IV',
    cmdDesc:'Your White and Blue spells cost {1} less; opponents\' spells cost {1} more. The side that built the system has the advantage.',
    str:["Will design the process that prevents the specific disaster that happened in 2019 from ever happening again.","Documents the decision and the dissent.","Builds systems in which the wrong answer is structurally hard to reach, even by people trying.","Reads the policy as written, then as intended, and can produce a version that survives both readings."],
    weak:["Has prepared a framework for selecting the framework.","Subsection 4(b)(ii) clearly states the kitchen is for staff only. The fire department, regrettably, is not staff.","Treats 'we could just try it' as a category of moral injury.","Will arrive at the right decision two weeks after it would have helped.","Confuses 'the rule has been followed' with 'the problem has been solved'."],
    roles:'COO, Compliance, Strategic Planning, Governance, General Counsel, Risk Management'
  },
  'SELESNYA':{
    name:'SELESNYA',
    tag:'Community Through Nature',
    colors:['W','G'],
    philosophy:"You believe people thrive when they belong to something larger than themselves. Communities, like trees, take a long time to grow and longer to repair when damaged. You'd rather have the slow team that holds together than the fast team that doesn't.",
    desc:"You remember everyone's kids' names and which kid is having a hard year. You build the team that, three years in, still likes each other.",
    pubBanter:"Every conflict needs a healing circle and a 1:1 about feelings. Sometimes results matter more than us all liking each other. The team that likes each other is, annoyingly, the one still delivering three years later.",
    cmd:"Trostani, Selesnya's Voice",
    cmdDesc:'Whenever a creature enters your battlefield, you gain life equal to its toughness. Tap to populate (create a copy of a creature token you control). The card rewards growth-by-accumulation and protects the group while doing it.',
    str:["Remembers the names of everyone's children and which one is having a hard year, and acts on it.","Builds a team that, three years in, still likes each other.","Will sit with a struggling colleague until the colleague has calmed down.","Finds the version of the plan that nobody has to lose for it to work.","Holds the room together during the kind of week that historically dissolves rooms."],
    weak:["Has been workshopping the same difficult conversation, internally, since spring.","Believes, with a faith that survives all evidence, that the person who keeps doing the thing will stop doing the thing.","Mistakes everyone-being-okay-with-this for this-is-going-to-work.","Will keep the underperformer on the team because firing them feels worse than the cost they impose on the team.","The offsite has been extended into a four-week retreat."],
    roles:'Chief People Officer, HR, Culture & Values, Team Leads, Community Programs, Volunteer Coordination'
  },
  'ORZHOV':{
    name:'ORZHOV',
    tag:'Structure Through Power',
    colors:['W','B'],
    philosophy:"You believe structure is the foundation of ambition. Systems should reward the people who maintain them. Hierarchy creates order, and the people who built the hierarchy should benefit from the order they built. You think that's honest about how institutions work.",
    desc:"You combine the rule-builder's patience with the player's eye for advantage. The hierarchy serves the organisation and it serves you. You don't see why those two things would be in tension, and you've spent a career proving they aren't.",
    pubBanter:"Every favour gets logged. Every policy gets enforced selectively. You always end up holding the ledger of who owes whom. The ledger has been correct, to the cent, for eleven years.",
    cmd:'Obzedat, Ghost Council',
    cmdDesc:'ETB: opponent loses 2, you gain 2. At end step, may exile Obzedat and return at next upkeep with haste. The institution phases out when threatened and phases back in when convenient.',
    str:["Knows just how to set up bureaucracy that works, and why it's worthwhile doing.","Designs the hierarchy where the right people advance and the merely loud ones politely stall.","Holds the institutional memory, including the parts the institution has been trying to forget.","Can find the budget, and knows who to talk to if there isn't one.","Makes the ambitious version of the plan defensible on paper, then defends it on paper and in the meeting."],
    weak:["Tries to balance what is right with what is personally valuable. If the balance tips, things go sideways fast.","Considers loyalty a four-year vesting schedule, and treats your performance review accordingly.","The favour you accepted in 2022 is now load-bearing in their plan for 2026.","Promotes the deserving and the indebted, and people aren't sure which they are.","People have seen process and policy weaponised often enough to know it could happen to them."],
    roles:'COO, Finance, Legal/Compliance, Senior Management, Estate Planning, Institutional Investing'
  },
  'DIMIR':{
    name:'DIMIR',
    tag:'Intelligence Through Control',
    colors:['U','B'],
    philosophy:"You believe knowledge is the most reliable form of leverage. You watch carefully. You note what people say and what they don't. The best moves are the ones nobody saw coming. You've learned not to give your information away cheaply.",
    desc:"You're often the one who knows what everyone is after. You don't share that lightly. You'd rather know more than be known.",
    pubBanter:"You know things and never say how. Not every conversation is a negotiation. The one time it mattered, you knew three weeks early, and we've stopped asking.",
    cmd:"Yuriko, the Tiger's Shadow",
    cmdDesc:'Ninjutsu lets you swap a creature in for one already attacking. Whenever a Ninja you control deals combat damage to a player, reveal the top card of your library and put it into your hand. Each opponent loses life equal to its mana value.',
    str:["Knows things, and knows that knowledge is currency.","Has spotted three of the last five problems before anyone else noticed they were problems.","Reads the room for what isn't being said, and knows how to weaponise it.","Trades favour for favour without ever calling it that and counts everything.","Adapts faster when the rules change, because they were watching for that already."],
    weak:["Knowledge and favours are only as good as your ability to use them to get results.","Everything is an analytical negotiation, even discussing where to go for lunch.","Has been told they're hard to read, and took it as a compliment.","When trust is required quickly, a lifetime of careful information-management becomes a liability.","Carries everyone's secrets. This is exhausting in ways they pretend it isn't."],
    roles:'Strategic Planning, M&A, Competitive Intelligence, VC/PE, Investigative Journalism'
  },
  'IZZET':{
    name:'IZZET',
    tag:'Discovery Through Experimentation',
    colors:['U','R'],
    philosophy:"You believe understanding comes through trying. You'd rather build the prototype that probably doesn't work than wait six months for the design that definitely won't. Most of your failed experiments are how you learned the things your peers are still arguing about.",
    desc:"You combine analytical curiosity with experimental urgency. You will have built v2 by Wednesday.",
    pubBanter:"You experimented on production again and now everything's broken. You hand-waved it away as \"an interesting experiment\" and then started working on V2 while customers are yelling at us.",
    cmd:'Niv-Mizzet, Parun',
    cmdDesc:'Can\'t be countered. Whenever you draw a card, deal 1 damage to any target. Whenever a player casts an instant or sorcery spell, you draw a card. The two abilities form a chain, so every instant or sorcery becomes a card and every card becomes damage.',
    str:["Will try the thing that probably won't work, on the chance it does.","Generates more usable ideas in a 20-minute meeting than everyone else in the meeting combined.","Treats failure as data.","Will rebuild a system at 11pm because they thought of a better way at 10:47pm.","Knows the spec well enough to find the bit where the spec is lying."],
    weak:["Has three projects in flight, and one of them is quietly on fire.","Loses interest exactly when the idea has to become a thing anyone else can use.","Documentation is a problem for next quarter.","Underestimates how much joy other people derive from things working slightly ineffectively but still working.","Will solve the wrong problem brilliantly."],
    roles:'R&D, Innovation Labs, Product Development, Startups, Quant Research'
  },
  'GRUUL':{
    name:'GRUUL',
    tag:'Power Through Instinct',
    colors:['R','G'],
    philosophy:"You believe modern busy life overcomplicates everything. Trust your gut and use what's already worked. The fancy new approach is usually the old approach with extra steps that didn't need adding. When in doubt, hit it harder.",
    desc:"You combine instinct with the things that have already worked. The result is action that nobody planned but everyone recognises afterwards. You're the team's stopgap when the plan stops working.",
    pubBanter:"You smash through everything and ignore feedback. Six months of subtle people had got precisely nowhere, which is why we called you.",
    cmd:'Borborygmos Enraged',
    cmdDesc:'Whenever Borborygmos deals combat damage to a player, reveal the top three cards: lands go to your hand, the rest to your graveyard. Discard a land card: 3 damage to any target. The lands you\'ve been hoarding for the long game become damage right now.',
    str:["Calls the question when everyone else is still negotiating which question to call.","Will not pretend the meeting was useful when it wasn't.","Brings energy into a stalled room.","Knows when the answer is 'just do it' and is correct more often than is comfortable.","The kind of teammate who is on the work and gone the moment it's done."],
    weak:["Has been heard saying 'this is just process for the sake of process' about laws or processes that matter.","Will burn down the agenda when given enough latitude.","Treats nuance as someone else's job, which is fine until they're the only one in the room.","Can be promoted into roles where 'just do it' is the wrong instinct.","Confuses 'I dealt with that quickly' with 'I dealt with that well'."],
    roles:'Operations, Sales, Construction, Military, Crisis Response, Frontline Trades'
  },
  'RAKDOS':{
    name:'RAKDOS',
    tag:'Freedom Through Chaos',
    colors:['B','R'],
    philosophy:"You believe rules are mostly for people too afraid to live. Want it, take it. Regret is what people invented to explain why they didn't. You've decided the consequences are worth it.",
    desc:"You combine self-interest with impulse and do what you want, openly. The room finds you exhausting. What you said is what you'll do.",
    pubBanter:"You treat every meeting like a comedy set. The room loves it. The people picking up the dropped balls afterwards do not love it. You haven't always been able to tell which group you're talking to.",
    cmd:'Rakdos, Lord of Riots',
    cmdDesc:'Creature spells you cast cost {1} less for each life your opponents have lost this turn. Can\'t be cast unless an opponent has lost life. The card requires that the party has already started before the leader shows up.',
    str:["Will say the thing in the meeting that everyone was thinking but nobody planned to say.","Catches the meeting that has lost its purpose and either blows it up or helps it find a new, usually more interesting one.","Reliable in a crisis precisely because crises are when their instincts and the situation finally line up.","Treats company-line phrases with suspicion.","Doesn't pretend to be someone they aren't."],
    weak:["Treats boredom as a moral category. A quiet period of stable success becomes, itself, a problem.","Has been described as 'lots of fun' and 'somehow the reason we lost two team members' in the same review.","Will undermine an institution they need, on principle, then be surprised it's gone.","Comedy timing is good. The judgement about which moments deserve it is patchier.","Confuses sincerity in others with stuffiness."],
    roles:'Disruptive Startups, Aggressive Sales, Entertainment, Activism, Creative Direction'
  },
  'GOLGARI':{
    name:'GOLGARI',
    tag:'Growth Through Decay',
    colors:['B','G'],
    philosophy:"You believe nothing is wasted. What dies feeds what comes next. Failure teaches; success teaches differently. The cycle continues whether you act or don't.",
    desc:"You combine clear-eyed self-interest with the long patience of things that grow. You let the project die, and harvest what's still useful. The team finds this slightly unsettling. They come to you when things have died or to understand the long game.",
    pubBanter:"Everything is a metaphor about cycles of life. Sometimes things need to work today. You did tell us the strategy was rotting a year before it fell over.",
    cmd:'Meren of Clan Nel Toth',
    cmdDesc:'Whenever another creature you control dies, get an experience counter. At end step, return a creature from your graveyard with mana value ≤ experience. The card turns each death into a growing recursion engine.',
    str:['Can sense when initiatives or projects are dead or dying, even when they don\'t know it yet.','Will keep failing initiatives on life support exactly long enough to harvest the useful bits.','Has seen this crisis before, and already knows roughly when it ends.','Refuses to throw out the old code, and will need it eventually.','Treats failure as compost.'],
    weak:['Will happily let a project die because dying is, in some sense, the point.','Spent eighteen months telling everyone the strategy was rotting from the inside, and didn\'t try to fix it.','Has a folder labelled \'might be useful in three years\' that contains everything from the last five years.','Mistakes \'something new will arise from this eventually\' for \'I have therefore handled the problem\'.','Doesn\'t ever seem to create anything new.'],
    roles:'Sustainability, Turnaround/Restructuring, Operations, Insolvency Practice'
  },
  'SIMIC':{
    name:'SIMIC',
    tag:'Evolution Through Design',
    colors:['G','U'],
    philosophy:"You believe evolution doesn't stop and shouldn't be expected to. Everything can be improved. Nature provides the template. Intelligence accelerates the process when applied carefully.",
    desc:"You combine organic growth with deliberate optimisation. You adjust the thing instead of replacing it. Two years later, the thing has fundamentally changed and nobody remembers the original.",
    pubBanter:"You optimise everything to death. In six months you'll have shipped at 95%, but no-one will have a job because the product was meant to ship six months ago.",
    cmd:'Prime Speaker Vannifar',
    cmdDesc:'Tap and sacrifice a creature: search for a creature with mana value exactly 1 more, put it onto the battlefield. The card requires sacrificing the current creature to upgrade to a slightly bigger one.',
    str:["Builds the version they wanted, two iterations after the version everyone settled for.","Notices the small system changes that make an incremental difference, and knows how to implement them.","Understands how processes and systems work, and evolve over time. Tends to them like a deliberate gardener.","Will rework the inherited process slightly better every quarter, until two years later it's much better and entirely different.","Has a clear personal standard of 'finished' that's higher than almost anyone else's."],
    weak:["Struggles to ship something they consider unfinished, even when 'unfinished' means 'one paragraph short on the docs'.","Improves things that were not the bottleneck.","Holds the team to the bar in their head, which is mostly higher than the bar in anyone else's head.","Suspicious of 'good enough' as a moral position, even when good enough is the correct call.","Has, at least once, made a process so robust that nobody outside it understood it."],
    roles:'Product Management, Process Improvement, Biotech, UX Research, Platform Engineering'
  },
  'BOROS':{
    name:'BOROS',
    tag:'Justice Through Action',
    colors:['R','W'],
    philosophy:"You believe some things are worth fighting for. Justice requires action. When something matters to you, you commit fully, and you'd rather be exhausted at the end than indifferent at the start.",
    desc:"You combine moral conviction with immediate action. The team you build goes through walls together.",
    pubBanter:"You treat quarterly planning like D-Day. Months on, the intensity is exhausting. Relax for one minute and stop talking about the greater good.",
    cmd:'Aurelia, the Warleader',
    cmdDesc:'Whenever Aurelia attacks for the first time each turn, untap all your creatures and gain an additional combat phase. One combat becomes two. Once you\'ve committed to attacking, you commit again.',
    str:['Will run at the problem while everyone else is still considering whether a meeting about it might be a good idea.','Builds a team that goes through walls together.','Names things that are unfair or wrong where others might shy away.','Commits to the work as if losing it would mean something.','Good in a crisis, and someone people trust to solve things well.'],
    weak:['Has a hammer. Struggles to not use it if something feels wrong or unfair.','Treats \'we could just send an email\' as a form of moral cowardice.','Can\'t quite tell the difference between a difficult conversation and a battle, and tends to err in favour of the second.','Hears that something unfair may have happened and is already out of their seat, before it has been verified.','Has a list of people who are with us and a list of people who are not with us or are a wrong\'un.'],
    roles:'Military, Crisis Management, Mission Nonprofits, Sales Leadership'
  },
  'BANT':{
    name:'BANT',
    tag:'Harmony Through Structure',
    colors:['W','U','G'],
    philosophy:"You believe civilisation, knowledge, and patience all matter, and that most people pick one and pretend the other two are nice-to-haves. The trade-off is time. You've decided the time is worth it.",
    desc:"You run the meetings where every voice is heard and the decision is one we can all live with five years out. The thing takes time and is almost always worth it.",
    pubBanter:"You need three rounds of consultation and a stakeholder map to decide where to go for lunch, and it's already 3pm.",
    cmd:'Rafiq of the Many',
    cmdDesc:'Whenever a creature you control attacks alone, it gets +1/+1 (exalted) and double strike. The card rewards focused, single-target commitment.',
    str:['Holds analysis, fairness, and timing in one mental model and rarely drops any of them.','Builds strategies that a team will own, because everyone helped build them.','Has the best chance of building fair things that last.','Plays the four-year game while everyone else is playing the four-week one.','Can create a psychologically safe space where people feel supported.'],
    weak:['Can prioritise team cohesion and accuracy over results.','Believes a well-run process can prevent conflict.','Can struggle in a crisis, or when things are needed fast and no good option exists.','Can mistake "the data supports it and we agreed" for "this is going to work".','Can struggle to have difficult conversations.'],
    roles:'Executive Leadership in slow-growth sectors, Strategic HR, Educational Leadership, Policy Development'
  },
  'ESPER':{
    name:'ESPER',
    tag:'Perfection Through Control',
    colors:['W','U','B'],
    philosophy:"You believe optimal outcomes need fair systems, deep analysis, and the willingness to make the call. Most people drop one of the three.",
    desc:"You're rarely the warmest person in the room. Your decisions are often still holding up after six months of pressure. People can forget you being ruthless if things work.",
    pubBanter:"Every conversation with you is like talking to a spreadsheet. The unsettling thing is the spreadsheet keeps making the right calls.",
    cmd:'Sharuum the Hegemon',
    cmdDesc:'When Sharuum enters, return a target artifact card from your graveyard to the battlefield. The card picks up what was lost and gets the machine running again.',
    str:['Keeps the org chart and the budget in mind at once.','Made the move that mattered four quarters ago, when nobody noticed.','Builds systems which make it easy for the right answer to end up being the path of least resistance.','Understands why bureaucracy is needed and how to use it to help their team.','Is able to understand and name trade-offs and make the right decision dispassionately.'],
    weak:['Has solved for the optimum and can be mildly puzzled when people impacted by that optimisation seem upset.','There is an implicit tension between designing equitable frameworks and wanting those frameworks to favour them.','Can struggle to take action in unclear, information-poor situations such as a crisis.','Soft power is powerful, but every so often a bit of high-energy noise achieves things faster.','Refers to colleagues by their function and value rather than their name.'],
    roles:'CFO/Finance, Chief Compliance Officer, Strategic Operations, Management Consulting'
  },
  'GRIXIS':{
    name:'GRIXIS',
    tag:'Power Through Ruthless Action',
    colors:['U','B','R'],
    philosophy:"You believe intelligence, ambition, and aggression compound. The people who can't combine the three lose to the people who can. You'd rather achieve the outcomes that matter to you and be disliked than lose and be admired.",
    desc:"You read the situation faster than most and move on the decision before anyone has had time to object. The room finds you reliable when something needs to happen now.",
    pubBanter:"There is never a calm day with you around. If a meeting isn't adding value, the pin on the grenade gets pulled.",
    cmd:'Nekusar, the Mindrazer',
    cmdDesc:'Whenever an opponent draws a card, Nekusar deals 1 damage to them. Force the table to draw with your spells; every card they need wounds them.',
    str:['Calls the move before everyone else has finished diagramming the board, and is usually right.','Reads which way something will move three weeks before it folds, and is already positioned ready to go.','Almost always able to adjust faster than the situation through prediction and action.','Is happy to name the cost out loud and to pay it.','Builds ruthlessly effective teams that deliver.'],
    weak:['Has used "it\'s just business" to describe something that was, by any honest reading, slightly personal.','Earns trust in ten meetings and spends it in one.','Can risk burning people or burning them out.','The optimisation works. The optimisation can also produce a host of ongoing issues.','Believes pressure improves people, and is sincerely puzzled when colleagues leave for somewhere with less of it.'],
    roles:'Turnaround CEO, Competitive Strategy, High-Stakes Trading, Private Equity'
  },
  'JUND':{
    name:'JUND',
    tag:'Survival Through Hunger',
    colors:['B','R','G'],
    philosophy:"You believe survival rewards the hungry and the adapted. You trust your instincts because they've kept you here. You let the things that aren't working exit or die, or you kill them. People who can't do this are running on borrowed time and don't know it yet.",
    desc:"The team finds you slightly alarming most of the time, but very useful on the day that competition shows up.",
    pubBanter:"Every meeting becomes a forum to push. Every project is a fight you intend to win. We want you in the foxhole. We do not want you on the calendar for a chat about feelings.",
    cmd:'Prossh, Skyraider of Kher',
    cmdDesc:'When you cast Prossh, create X 0/1 Kobolds where X is the mana spent. Sacrifice another creature: Prossh gets +1/+0 until end of turn. The card turns your own resources into a leader who grows by eating them.',
    str:['Will go for the throat of the project nobody else wanted to fight.','Treats "this is hard" as a description and carries on.','Will set a target nobody believes in, then hit it, partly out of spite.','Names who\'s in charge and what they want. Most rooms had been agreeing not to mention these things.','Has been through three layoffs and is still here.'],
    weak:['Treats the long-term cost of how they got here as a problem for whoever inherits the problem.','Built a pace nobody else can hold and is mildly puzzled when the team doesn\'t share it.','Has explained, with a straight face, that the people who left "weren\'t built for this".','Believes nuance is what people do when they don\'t have a clear answer.','Is high-performing, but people are slightly afraid of them.'],
    roles:'Aggressive Sales, Competitive Industries, Startups, Sports, Private Equity'
  },
  'NAYA':{
    name:'NAYA',
    tag:'Power Through Community',
    colors:['R','G','W'],
    philosophy:"You believe strength comes from a community aligned with natural purpose. The fancy abstract approaches are downstream of having a team that shows up. You've built that team. You don't apologise for the volume of work because it all matters.",
    desc:"You walk in and the temperature goes up two degrees. People believe in things harder around you.",
    pubBanter:"Every task needs pep talks and a marching band. We just needed to update a spreadsheet.",
    cmd:'Samut, Voice of Dissent',
    cmdDesc:'Your creatures have haste. Tap: untap another creature. Everyone moves as fast as Samut does, and she pulls the slow ones into the action.',
    str:['Walks into a stalled room and the room remembers what it was doing.','Builds a team that, three weeks in, would run through walls for each other.','Knows everyone and has had drinks with everyone.','Will start the thing nobody else thought was worth starting, and it will be worth starting by week two.','The earnestness is real, and other people\'s irony bounces off it.'],
    weak:['Treats the third hour of the Tuesday call with the same energy as the first ten minutes.','The big speech was on Wednesday, and the follow-up big speech is on Thursday.','Believes the more interesting and fairer idea wins, which is almost always untrue.','Has so much enthusiasm for the work that quieter colleagues can\'t get a word in to say where it should point.','Is three suburbs away from the detail.'],
    roles:'Startups, Marketing, Politics, Sales, Event Planning, Community Building'
  },
  'ABZAN':{
    name:'ABZAN',
    tag:'Endurance Through Tradition',
    colors:['W','B','G'],
    philosophy:"You believe lasting power comes from patience, pragmatism, and community held together over decades. Invest in what endures. Cut what doesn't. The flash-in-the-pan strategies look impressive for a quarter, and you're playing the next decade.",
    desc:"You build things that are still standing in 2034 because they were built by someone who remembers 2014. You know who can be counted on and who can't.",
    pubBanter:"You block every new idea and keep a ledger of favours going back decades.",
    cmd:'Karador, Ghost Chieftain',
    cmdDesc:'Costs {1} less for each creature card in your graveyard. May cast a creature from graveyard each turn. Karador gets cheaper, and more capable, the more history you have.',
    str:['Builds things designed to still be standing in 2034, and largely succeeds, because they were designed by someone who remembers 2014.','Has outlasted four CEOs and one merger.','Will choose "still working in five years" over "mildly impressive in the next quarter" every time.','Knows who can be counted on in specific weather.','Has carried the organisation through its worst years.'],
    weak:['Has explained, with great patience, why the new system won\'t work. Has been right twice and wrong four times.','The promotion goes to the loyal before the deserving.','The pilot programme has been in pilot since 2019.','Someone made a comment at the 2017 offsite. They have been quietly underweighted in every staffing decision since.','Has built a system in which everyone owes someone else a favour.'],
    roles:'Family Businesses, Legal, Traditional Industries, Politics'
  },
  'JESKAI':{
    name:'JESKAI',
    tag:'Excellence Through Discipline',
    colors:['U','R','W'],
    philosophy:"You believe excellence comes from disciplined practice applied with passion and held within principles. The work is the thing. The hours are the cost and the cost is fair. Most people who think they're excellent haven't put in the hours, and you have.",
    desc:"You've put in the hours on three different things and are world-class at all of them. You don't lead with it. When asked, you'll explain the method.",
    pubBanter:"Everything we do is basic, apparently. You roll your eyes at our approach constantly. You're irritatingly right about our approach most of the time.",
    cmd:'Narset, Enlightened Master',
    cmdDesc:'When Narset attacks, exile the top four cards. You may play non-creature cards exiled this way. Everything you\'ve trained for shows up when you swing.',
    str:['Has put in the hours on three different things and is world-class at all of them.','Catches the moral quandary in the position that no one else saw, and fixes it.','Plays the move three turns ahead, then explains why the previous turn was the point of leverage.','Demonstrates the standard by doing it.','Able to switch from the prepared plan to the live read mid-action, without showing the gear-change.'],
    weak:['Cannot quite hide that they think the room is, on average, beneath them.','Forgets the basics are basic because someone learned them. Has ruined the kickoff by leading with the advanced version.','Treats people who haven\'t put in their hours as a regrettable but tolerable feature of the workplace.','Will redo the work that was already correct because it could have been more correct.','Can mentor brilliantly. Will not, however, mentor anyone whose questions are too obvious.'],
    roles:'Consulting, Teaching, Professional Services, Strategy'
  },
  'SULTAI':{
    name:'SULTAI',
    tag:'Growth Through Exploitation',
    colors:['B','G','U'],
    philosophy:"You believe patient analysis and strategic positioning beat aggressive haste. Understand the cycles. Position yourself within them. Extract value over time, sustainably, before anyone notices you've been doing it.",
    desc:"You combine patience, intelligence, and a long view of who's holding what.",
    pubBanter:"You're slimy. You co-opt everyone's work and somehow it becomes part of your little empire. The empire is also the reason our team gets resourced and we resent it.",
    cmd:'Sidisi, Brood Tyrant',
    cmdDesc:'When Sidisi enters or attacks, mill 3. Whenever creature cards hit your graveyard from your library, create a 2/2 zombie. The card turns information loss into an army.',
    str:['Plays the eight-quarter game, in which the first six quarters look like nothing is happening.','Was already in the right meeting before anyone knew which meeting was going to be the right one.','Knows what every person at the table has to give, and what they think they\'re giving.','Has regularly been described as "helpful" by people who haven\'t quite yet noticed what they\'re being helped towards.','Has been planning this since the previous restructure.'],
    weak:['The other person\'s idea got better with their input. The other person\'s idea is now somehow on their slide.','Needs to be in the room where the conversation is happening, or have someone in there.','Has done several things that, taken together, would make an outside observer raise an eyebrow.','Will not move until the move is unloseable, which means missing the move that was winnable.','Is rarely the person someone would name as a close friend.'],
    roles:'Private Equity, VC, Corporate Development, Real Estate'
  },
  'MARDU':{
    name:'MARDU',
    tag:'Victory Through Sacrifice',
    colors:['R','W','B'],
    philosophy:"You believe decisive action within a clear hierarchy wins. Lead from the front and move fast. People will burn out. You take that seriously when it happens, and you also keep moving. The cost of losing the thing was higher than the cost of paying for the win.",
    desc:"The team moves at your pace. Some of the team keep up. If someone gets left behind, so be it.",
    pubBanter:"Every deadline is life or death. You glorify burnout as commitment. You'll flip tables to make us move faster. Those of us still here are exhausted.",
    cmd:'Alesha, Who Smiles at Death',
    cmdDesc:'Whenever Alesha attacks, pay {W/B}{W/B}: return a creature card with power 2 or less from graveyard, tapped and attacking. The card brings back the overlooked and underestimated, then leads them straight into the fight.',
    str:['Owns the call and doesn\'t relitigate it after the fact.','The bigger the stakes, the calmer the voice.','Knows who needs to be told what, and in which order.','Delivers the result. The cost is a separate conversation that, conveniently, someone else has to lead.','Holds the line when the line is dissolving.'],
    weak:['Treats months of hard work as a warm-up.','Has a quiet pride about the people on the team who "gave everything," and a quiet absence of curiosity about where they are now.','The costs of getting the win never make it onto the same slide as the win.','Sometimes has a peace-time. It is between Christmas and the second of January, inclusive.','Looks around after a successful quarter and is briefly surprised by how few of the original team are still in the room.'],
    roles:'Turnarounds, Crisis Management, Sales, Founding Teams, Competitive Markets'
  },
  'TEMUR':{
    name:'TEMUR',
    tag:'Power Through Adaptation',
    colors:['G','U','R'],
    philosophy:"You believe wild creativity and raw power combine best when guided by understanding. The right approach for this problem is probably not the approach for the last problem.",
    desc:"Your strategy adapts. Nobody who didn't pivot is further along than you are.",
    pubBanter:"We're constantly adapting to whatever idea pounced out of you this week. We've stopped trying to predict you.",
    cmd:'Surrak Dragonclaw',
    cmdDesc:"Can't be countered. Your creatures can't be countered. Your other creatures have trample. Once you've committed to the play, nothing stops it landing.",
    str:['Will sketch the new approach in the meeting and build the prototype that night.','Comes up with the angles that nobody else thought of.','Walks in with a new idea every morning. Some mornings the new idea is the right one.','Is calmest when the situation isn\'t.','Will try the thing nobody got permission to try.'],
    weak:['Has been on the same project for six weeks and rewritten the foundations three times.','The Monday plan is not the Wednesday plan.','Believes all plans at all stages are a starting point.','The team has, collectively, stopped scheduling anything more than two weeks out.','Brilliant in chaos. Mildly destructive in stability.'],
    roles:'Startups, Innovation, R&D, Creative Industries'
  },
  'WITCH':{
    name:'FOUR-COLOR (No Red)',
    tag:'Perfection Without Passion',
    colors:['W','U','B','G'],
    philosophy:"You believe sustainable success comes from patience, analysis, and quiet positioning. You don't see what passion adds. You'd rather get the right answer eventually than the dramatic answer immediately.",
    desc:"You're the person whose plans are still working in three years. You absorb urgency and decide whether it requires action. The team finds you calm in a way that's either reassuring or unnerving.",
    pubBanter:"We threw you a surprise party once, mostly as an experiment. You thanked us and asked whether the budget had come from contingency.",
    cmd:"Atraxa, Praetors' Voice",
    cmdDesc:'Proliferate at end step: add a counter of any kind already on a permanent or player. The card rewards slow, patient accumulation across multiple dimensions at once.',
    str:['Holds analysis, fairness, ambition, and patience without any of them outweighing the others.','Builds the strategy that compounds over years.','Wins the long argument by being in the room every time. The other people stopped coming three meetings ago.','Reads situations without the emotional component clouding the analysis.','Makes the right move early and doesn\'t need the credit.'],
    weak:['Lacks the internal alarm that says a window is closing. Important windows close while the analysis matures.','Can come across as emotionally absent. Colleagues sometimes wonder if they care about the work.','Dismisses passionate ideas as "inefficient" without considering whether the passion was load-bearing.','Treats joy and energy as variables that don\'t usefully feature in any equation worth running.','Has, occasionally, watched a crisis happen and analysed it correctly while taking no action.'],
    roles:'Operations, Finance, Strategy, Long-term Planning, Sovereign Wealth, Patient Capital'
  },
  'YORE':{
    name:'FOUR-COLOR (No Green)',
    tag:'Innovation Without Nature',
    colors:['W','U','B','R'],
    philosophy:"You believe progress comes from transcending what's already there. Tradition is data. The smart, ambitious team you've built around you will help you find what comes next.",
    desc:"You combine analytical rigour, ambition and urgency, without the patience to leave things alone just because they've been working. You build complex systems and rebuild them when they don't quite fit.",
    pubBanter:"You over-engineer everything. Every solution needs seventeen moving parts that'll need emergency fixes in two weeks.",
    cmd:'Breya, Etherium Shaper',
    cmdDesc:'When Breya enters, create two 1/1 thopter tokens. Then pay {2} and sacrifice two artifacts for various effects: 3 damage to a player or planeswalker, -4/-4 to a creature, or gain 5 life. The card exists to assemble parts, then disassemble them for value.',
    str:['Will deliver the thing that didn\'t exist yesterday, and treats this as the baseline.','Holds the thirteen-part architecture in their head and updates it mid-flight.','Has thought three steps past where everyone else stopped. Is mildly impatient that the others haven\'t caught up.','Will work late because the work isn\'t right yet.','Doesn\'t trust the manual process to stay correct, and quietly builds the automation that catches the human error before the human notices.'],
    weak:['Turns the grocery list into a system.','If the solution is short, the problem must have been wrong.','Has built a personal velocity that\'s incompatible with most human bodies, including their own.','Rebuilds things that were correct the first time.','Can\'t leave things alone, and the team\'s energy goes into keeping up with the changes.'],
    roles:'Tech Startups, Engineering Leadership, R&D, Disruption, FinTech, Founders'
  },
  'GLINT':{
    name:'FOUR-COLOR (No White)',
    tag:'Power Without Morality',
    colors:['U','B','R','G'],
    philosophy:"You believe effectiveness matters more than the rules of the room. Most \"ethics\" you encounter are someone's protection of a position, dressed up as principle. You can usually tell which is which, and you act accordingly.",
    desc:"You combine intelligence, ambition, urgency and adaptability, without the group-level loyalty that would keep you inside the lines. The team finds you brilliant and untrustworthy in roughly equal measure.",
    pubBanter:"Rules are for suckers, apparently. You hijack projects for fun and leave smoking wreckage everywhere. We never know what you're going to do next. The deal that saved the quarter was yours, closed in a way none of us will describe under oath.",
    cmd:'Yidris, Maelstrom Wielder',
    cmdDesc:'When Yidris deals combat damage, spells you cast this turn have Cascade. Cascade means when you cast a spell, exile cards until you hit one with lower mana value, then cast that for free. The card turns one decision into a chain of free decisions you don\'t have to justify.',
    str:['Will try the move that\'s technically against the rules on the chance that "technically against the rules" was the only thing keeping it from working.','Closes the deal that needed closing. Doesn\'t ask whether the next person needed to be on the call.','Treats new constraints as features of the terrain rather than moral statements, and routes around them.','Knows which rules can be broken, by whom, and at what cost.','Has no sacred cows. Will burn down the architecture two people built their reputation on if it stops working.'],
    weak:['Treats "is this okay?" as a question for someone else\'s department.','Will make commitments in good faith and exit them, in good faith, when the situation has updated.','The project they touched is now thirty percent better and forty percent on fire.','Has, by the third quarter, become someone the rest of the team works around rather than with.','When the consequences arrive, will be in a different role at a different company, mildly surprised to be asked.'],
    roles:'Disruption, High-Risk Ventures, Competitive Industries, Distressed Asset Acquisition, Activist Investing'
  },
  'DUNE':{
    name:'FOUR-COLOR (No Blue)',
    tag:'Action Without Analysis',
    colors:['W','B','R','G'],
    philosophy:"You believe action reveals truth faster than analysis. Overthinking is what people do when they're afraid to be wrong. You'd rather be wrong fast and recover than be right too late to matter.",
    desc:"You combine community, ambition, urgency and patience, without the analytical step that would slow any of it down. You commit on instinct and figure it out in motion. The team that follows you is loyal and slightly bruised.",
    pubBanter:"You charge in on instinct every time. By the time we've picked up the pieces from the last impulse, you're three impulses ahead.",
    cmd:'Saskia the Unyielding',
    cmdDesc:'As Saskia enters, choose a player. Damage your creatures deal to a player is also dealt to the chosen player. The card turns every attack into double the damage on the table.',
    str:['Cuts through the meeting that was about to go around the table for a third time.','Reads the situation in the room and acts on it before the situation gets read out loud.','Walks in with the kind of energy that means something is about to happen.','Builds a team that will go anywhere with them, partly because they\'ve already gone.','Has never failed to ship by overthinking.'],
    weak:['Will dismiss the analysis as "analysis paralysis" before the analysis has finished its first sentence.','Treats the plan as something that happens to other people.','Has shipped the thing on Tuesday and is fixing the thing on Wednesday.','If the answer needed a spreadsheet, the question wasn\'t the right question.','The teams that work with them love them. The teams that have to clean up after them are quieter about it.'],
    roles:'Sales, Operations, Crisis Response, Military, Frontline Leadership, Field Operations'
  },
  'INK':{
    name:'FOUR-COLOR (No Black)',
    tag:'Altruism Without Pragmatism',
    colors:['W','U','R','G'],
    philosophy:"You believe progress comes from serving something larger than yourself. You never exploit anyone, and that is the thing you're most proud of. It's also the part most likely to leave you holding the bill.",
    desc:"You combine order, knowledge, urgency and patience, without the self-interested calculation that would protect any of it. You help people. You build things that serve others. The team that gathers around you is loyal and somewhat worried about you.",
    pubBanter:"You're trying to help everyone at once and it's a circus.",
    cmd:'Kynaios and Tiro of Meletis',
    cmdDesc:'At your end step, you draw a card. Each player may put a land from hand onto the battlefield, then each opponent who skips the land draws a card. The card gives every player resources, so your turn enriches the whole table.',
    str:['Believes the work can be both useful and good.','Plans across community, ideas, energy and growth.','Walks into the cynical room and the cynicism quietly excuses itself for the rest of the meeting.','Holds the door open for the people the rest of the org has stopped noticing.','Finds the angle that helps everyone, partly by not considering whether anyone should be helped less.'],
    weak:['Cannot quite believe that some of the people in the room are optimising for themselves.','Has been used as the cover story for someone else\'s plan, twice, and is currently in conversation about it being a third time.','Three good causes in flight, none in clearly-defined scope.','Believes everyone is broadly trying, which is mostly true and almost never universally true.','Will give the win to the room rather than take it, and keeps ending up under-credited.'],
    roles:'Nonprofits, Education, Community Building, Social Enterprise, Cooperative Movement, Mission-Driven Leadership'
  },
  'WUBRG':{
    name:'FIVE-COLOR',
    tag:'Chaos or Mastery',
    colors:['W','U','B','R','G'],
    philosophy:"You believe every approach has its place. Context determines which one. The trick is knowing when to apply which.",
    desc:"You have access to everything. The result is either a Renaissance person or a generalist who hasn't picked one yet. The line between those two is harder to see from inside.",
    pubBanter:"You put the kitchen sink into every project. We are taking bets on which spinning plate crashes first.",
    cmd:'Kenrith, the Returned King',
    cmdDesc:'Five colours at once, with every angle available.',
    str:['Can take the technical role on Monday and the people role on Tuesday.','Holds five different framings of the problem at once, and the right one surfaces eventually.','Sees the same situation from analysis, ambition, structure, instinct, and patience in the same breath.','Speaks five different professional dialects fluently, and switches between them mid-sentence without noticing.','Notices what each other identity would notice. The disadvantage is being asked to do something with all of it.'],
    weak:['Holds five priorities and gives each one twenty percent of the energy.','Is, by their own honest assessment, the second-best person in the room at every individual thing, which is rarely the same as being useful.','In a Blue room, becomes Blue. In a Red room, becomes Red.','Cannot quite answer \'what do you believe\' without first asking what kind of room they\'re in.','Three years of running everything has produced a CV that, read cold, looks like five different people\'s CVs glued together.'],
    roles:'Consulting, General Tazri, Generalist Leadership, Facilitation, Portfolio Management'
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
