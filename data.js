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
      'MONO-W': "Get the emergency procedure out, and make sure nobody's left handling it alone.",
      'MONO-U': "Spend the first hour finding out exactly why it's failing. Then fix that.",
      'MONO-B': 'Cut it down to what I can deliver well, and present that as the win.',
      'MONO-R': "Start now and work straight through. I'll see what needs changing once I'm in it.",
      'MONO-G': "Stay calm, and fall back on the way that's always worked for us.",
      'AZORIUS': 'Agree one plan with everyone and give each person a clear job.',
      'DIMIR': "Work on it quietly. Tell people only what they need to know until it's sorted.",
      'RAKDOS': 'Throw out the plan and the rules, and do whatever gets it over the line.',
      'GRUUL': 'Strip it back to the simple version that works, and put everything into that.',
      'SELESNYA': 'Get everyone together and look after each other. Calm people fix things faster.',
      'ORZHOV': "Call in the favours I'm owed, and reward the people who come through.",
      'IZZET': 'Try two or three fixes tonight, and keep whichever works by morning.',
      'GOLGARI': "This version's dead. Salvage what still works and grow the next one from that.",
      'BOROS': "Rally everyone behind one goal, and lead from the front until it's fixed.",
      'SIMIC': "Fix it in small, tested steps. By the deadline it'll be better than the original.",
      'BANT': 'Read the numbers properly, then share the work out fairly and pace it.',
      'ESPER': "Work out what can be saved, then take every decision myself until it's done.",
      'GRIXIS': 'Find the fastest route to a result, and push everyone hard down it.',
      'JUND': "Kill the weak parts tonight, and throw everything at what's left.",
      'NAYA': 'Bring the whole group in and work alongside them. People rise to a shared push.',
      'ABZAN': "Dig in. We've outlasted worse than this, with fewer people and older kit.",
      'JESKAI': "Drill one clear plan with everyone until it's solid, then run it hard.",
      'SULTAI': "Save what's worth saving, and note who held up. I'll want them next time.",
      'MARDU': "Cancel all leave. Deadline first; we'll count the damage afterwards.",
      'TEMUR': "Ten minutes to read it. Then everything we've got, and change course as it changes.",
      'WITCH': 'Check whether the deadline is real or just something someone said loudly.',
      'GLINT': 'Take people and kit from other projects. Ask forgiveness once it ships.',
      'DUNE': "Start fixing things now and learn as we go. We'll correct course on the way.",
      'INK': 'Nobody gets hung out to dry for this, even if we miss the deadline.',
      'YORE': 'Put the sharpest people on a fresh approach. The old one has had its chance.',
      'WUBRG': 'Work out what kind of failure it is first, then use whatever fits.'
    }
  },
  CONFLICT: {
    id: 'CONFLICT',
    context: "Two people on your team are arguing hard over a decision you'll have to answer for.",
    responses: {
      'MONO-W': 'Hear both out in front of the team, and decide by the rules we agreed.',
      'MONO-U': 'Get the evidence for each side, and decide once I understand both properly.',
      'MONO-B': 'Make the call myself, and make sure both know it was mine to make.',
      'MONO-R': 'Get it all out in the open today, then make the call.',
      'MONO-G': 'Give it a few days. Most arguments settle on their own if left alone.',
      'AZORIUS': 'Set out the criteria first, then judge both cases against them, openly.',
      'DIMIR': 'See each one alone first. What they say privately decides it.',
      'RAKDOS': 'Back whichever of them wants it more. Hunger gets things done.',
      'GRUUL': "Go with my gut on which one's right, and tell them straight.",
      'SELESNYA': 'Get the whole team talking until we find something everyone can live with.',
      'ORZHOV': 'Settle it by rank and record. Whoever has earned the say gets it.',
      'IZZET': 'Try both ideas on a small scale this week, and let the results decide.',
      'GOLGARI': 'One idea has to die. Let it, and keep its best bits for later.',
      'BOROS': "Decide quickly on what's right for the cause, and expect both to commit fully.",
      'SIMIC': 'Splice the two ideas together and test it. The hybrid usually beats both parents.',
      'BANT': 'Take the time to hear both and check the figures. Then find common ground.',
      'ESPER': 'Weigh both against clear criteria, then make the call and stand by it.',
      'GRIXIS': 'Best case on the table, both of you. Whichever holds up gets the budget.',
      'JUND': 'Let them fight it out. The stronger case, and the stronger person, will show.',
      'NAYA': "Remind both what we're here for, then let the whole team decide.",
      'ABZAN': "Go with what's served us for years, unless the new idea clearly beats it.",
      'JESKAI': 'Good. Proper debate, with rules: no interrupting, and you each argue the other side.',
      'SULTAI': "Let them argue while I study both. I'll decide once one has clearly weakened.",
      'MARDU': "Give them an hour. If they can't agree, I decide, and we move.",
      'TEMUR': "Ask which idea still works when everything's going wrong. Do that one.",
      'WITCH': 'Take the heat out first. Then compare both on the facts, slowly.',
      'GLINT': "Forget whose call it is. I'll make it while they're busy arguing.",
      'DUNE': "Pick one and start. We'll know within a week if it's wrong.",
      'INK': 'Find a way forward where nobody loses face, even if it takes longer.',
      'YORE': 'Whichever works at ten times the size wins. Show me both working next week.',
      'WUBRG': 'Work out what kind of argument it is, then handle it the way it needs.'
    }
  },
  PIVOT: {
    id: 'PIVOT',
    context: "You're offered a job doing what you love. It pays less and might not last.",
    responses: {
      'MONO-W': "I'd talk to my family first. I can't leave them in a bad spot.",
      'MONO-U': "Ask to see the books and the plan. If they hold up, I'll go.",
      'MONO-B': "Passion doesn't pay rent. I'll take it only if I get significant equity.",
      'MONO-R': "Yes. I've wanted this for years, and I'll deal with the risk.",
      'MONO-G': "Stay. I've built a good life where I am, and I'm content with it.",
      'AZORIUS': 'Only with a proper handover here and the terms in writing there. Then maybe.',
      'DIMIR': 'Thank them, then use the offer to get a pay rise where I am.',
      'RAKDOS': "Take it. I'd rather crash doing what I love than coast doing this.",
      'GRUUL': "Take it. My gut's been telling me this for years.",
      'SELESNYA': "If they're decent people and I can bring my lot with me, I'll go.",
      'ORZHOV': "Depends on the title. If it's a step up, I'll take the pay cut.",
      'IZZET': "Take it. I'll learn more in a year there than in five here.",
      'GOLGARI': "This career died a while ago. I've just been too polite to bury it.",
      'BOROS': "If it's a fight worth having, I'm in. All the way, starting Monday.",
      'SIMIC': "I don't have half the skills it needs yet, and I'll grow them.",
      'BANT': "Yes, once I've six months' savings and a way back if it folds.",
      'ESPER': 'Renegotiate. The job I love, with security clauses I dictate.',
      'GRIXIS': "Take it as a stepping stone. In a few years I'll run my own.",
      'JUND': "Comfortable people get eaten, and I've been comfortable too long. I'll take it.",
      'NAYA': "Take it. My people will back me, and if it folds they'll be there.",
      'ABZAN': "Only if it'll still be paying the mortgage in twenty years. It won't.",
      'JESKAI': "I'd take it to get properly good at the craft. Training plan by Friday.",
      'SULTAI': "I'll wait. The right offer comes once the right people have seen what I do.",
      'MARDU': "Take it today, before somebody quicker does. I'll sort out the details on the way.",
      'TEMUR': "Provided nobody tells me how to do it, I'm going.",
      'WITCH': 'Run the numbers calmly. If the upside beats the risk on paper, accept.',
      'GLINT': 'Go if it moves me forward. I owe this place nothing beyond my notice.',
      'DUNE': "Say yes and start. If it fails, I'll find out fast and move on.",
      'INK': "If it does good, yes. I'll manage on less.",
      'YORE': "I've been meaning to rebuild myself from scratch anyway. This is the excuse.",
      'WUBRG': 'Depends where I am in life. Earlier on, yes. Later, only with a cushion.'
    }
  },
  MISTAKE: {
    id: 'MISTAKE',
    context: "You've made a serious mistake, and it's cost real time and money.",
    responses: {
      'MONO-W': "Apologise to the team, properly. Then work evenings until it's right for them.",
      'MONO-U': 'Trace exactly how it happened. Nobody touches it until I understand why.',
      'MONO-B': 'Limit the damage, and make sure it costs me as little standing as possible.',
      'MONO-R': "Say it's mine, straight out, and get stuck into fixing it.",
      'MONO-G': 'Everyone does this once, and that was mine. On we go.',
      'AZORIUS': "Report it through the proper channels, then change the process so it can't recur.",
      'DIMIR': 'Find out who knows what before I say a word, then choose my moment.',
      'RAKDOS': 'Own it and move on. Anyone who never breaks anything never does anything.',
      'GRUUL': 'Own it. I broke it, and I can take the shouting.',
      'SELESNYA': 'Tell the team straight away and ask for help. Nobody fixes these alone.',
      'ORZHOV': 'Pay whatever it costs to put right, and consider the debt settled.',
      'IZZET': 'Work out what it taught me, then try a better fix straight away.',
      'GOLGARI': "Salvage what's useful from the wreck, and build the next attempt on it.",
      'BOROS': 'Take full responsibility, on the record, and make sure it never happens again.',
      'SIMIC': 'Treat it as a lesson, and adapt how I work step by step.',
      'BANT': 'Keep the team out of the blast radius. Then fix it properly, in order.',
      'ESPER': 'Tell the whole story myself, numbers first, before the rumours do it worse.',
      'GRIXIS': 'Fix it fast and own it. Then take the next big risk anyway.',
      'JUND': "Take the hit and keep going. I've survived worse than this.",
      'NAYA': "I feel awful, and I'll put every bit of that into fixing it.",
      'ABZAN': 'Take the telling-off. Twelve years of turning up counts for something here.',
      'JESKAI': "Work out exactly where my technique slipped. Drill it until it can't slip again.",
      'SULTAI': "Weigh it honestly, and if it can't be saved, get out early.",
      'MARDU': "Dwelling is for later. I'll say who fixes what, and we fix it tonight.",
      'TEMUR': "That plan's dead. Change course now on instinct, and again if needed.",
      'WITCH': "Find the cause calmly and fix the process. Apologies won't stop it happening again.",
      'GLINT': "It happened, so deal with it. I'm not apologising for trying to win.",
      'DUNE': 'Skip the lecture. Tell me what I need to do to fix it.',
      'INK': "I'm so sorry. I'll do whatever it takes so nobody else gets in trouble.",
      'YORE': 'Build the automated check that would have caught it. Then nobody can make it again.',
      'WUBRG': 'Size it up first. Some mistakes need an apology, some a new system.'
    }
  },
  BURNOUT: {
    id: 'BURNOUT',
    context: "You're exhausted, and there's more on your plate than you can carry.",
    responses: {
      'MONO-W': 'Say so plainly, and ask for the work to be shared out fairly.',
      'MONO-U': 'Work out which tasks matter most. The rest can wait or go.',
      'MONO-B': 'Drop the lowest-value work today. Nobody gets a medal for drowning.',
      'MONO-R': "Take tomorrow off, without asking. I'll come back and hit it fresh.",
      'MONO-G': "Early nights and an hour in the garden. It'll look smaller by the weekend.",
      'AZORIUS': "File a formal request for more people. Until it's approved, earliest deadline first.",
      'DIMIR': "Tell nobody I'm struggling. Move a few deadlines, one private word at a time.",
      'RAKDOS': 'Ditch whatever bores me, and spend my energy on what I want.',
      'GRUUL': "The calendar's the problem. I've declined every meeting and I'm just doing the work.",
      'SELESNYA': "Admit I'm drowning and let the team take some. I'd do the same for them.",
      'ORZHOV': 'Call in my favours. Everyone who owes me a debt helps me now.',
      'IZZET': 'Try a different way of working this week, and see what frees up time.',
      'GOLGARI': 'Let half of it quietly die. Whatever survives a month without me was worth keeping.',
      'BOROS': 'Push through to the end of this, then rest properly. It matters too much.',
      'SIMIC': 'Change one habit a week, and keep whatever makes the most difference.',
      'BANT': 'Sort the list, then cut it to a load I could carry for a year.',
      'ESPER': "Delegate everything. I'll draw the plans; other people can lay the bricks.",
      'GRIXIS': 'Hand off whatever others can do, and keep my energy for what wins.',
      'JUND': "Grind. Everyone's tired; the job goes to whoever's still working at the end.",
      'NAYA': 'Get the whole team out for a night. Their energy is what keeps me going.',
      'ABZAN': "Pace it. We've had worse winters than this one, and we're all still here.",
      'JESKAI': "Tiredness means my routine's slipped. Tighten the routine.",
      'SULTAI': 'Let the keen ones take the slack. They want the experience; I want my evenings.',
      'MARDU': 'Finish the most important thing first, at full pace, then rest.',
      'TEMUR': "A week alone in the hills. I'll come back with a different plan.",
      'WITCH': "Plan the next month calmly, and say no to anything that doesn't fit.",
      'GLINT': "Cut whatever doesn't move me forward, whoever it upsets.",
      'DUNE': 'Stop dwelling on being tired. A hard run, then straight back to it.',
      'INK': 'Stop saying yes to everyone, starting now, even to people I want to help.',
      'YORE': 'Scrap how I work and rebuild it from nothing. Yes, this week.',
      'WUBRG': "Work out why I'm exhausted first. The fix depends on the cause."
    }
  },
  BETRAYAL: {
    id: 'BETRAYAL',
    context: 'Someone you trusted has just passed off your idea as theirs, in front of people who matter to you.',
    responses: {
      'MONO-W': 'Raise it fairly, then push for a way of recording ideas that protects everyone.',
      'MONO-U': 'Gather the evidence that it was mine, then show it to the right person.',
      'MONO-B': 'Correct the record calmly, in front of the same people. Nobody does that twice.',
      'MONO-R': "Call it out right there, in front of everyone. I won't swallow that.",
      'MONO-G': 'Let it go. These things come out in time.',
      'AZORIUS': 'Raise it through the proper process, with my drafts and their dates.',
      'DIMIR': 'Quietly make sure the right people learn it was mine. No fingerprints.',
      'RAKDOS': 'Take it back loudly, right then, and let them deal with the fallout.',
      'GRUUL': "Say 'That was mine' and get back to work. I don't do politics.",
      'SELESNYA': "Have a quiet word over coffee. I'd rather keep the friend than win the point.",
      'ORZHOV': "They now owe me. I'll collect when the time is right.",
      'IZZET': 'Let them have that one. My next idea will be better, and clearly mine.',
      'GOLGARI': "Let them run with it. If it fails, I'll be the one who saves it.",
      'BOROS': "If they'll do it to me, they've done it to others. I'm finding out who.",
      'SIMIC': "Interesting data point about their character. I'll update how far I trust them.",
      'BANT': 'Show them the evidence, calmly, in private. Go over their head only if I must.',
      'ESPER': 'Put the dated original in front of whoever decides, and let it settle the matter.',
      'GRIXIS': 'Take the credit back on the spot, with proof. Then watch them closely.',
      'JUND': 'Beat them on the next one, in public, and let people draw their conclusions.',
      'NAYA': "Tell my people what happened, loudly and with feeling. They'll know who to believe.",
      'ABZAN': "My record is longer than theirs. I'll outlast this, and I'll remember.",
      'JESKAI': 'Do the next one so well that nobody could ever mistake whose it is.',
      'SULTAI': "I say nothing. They'll do it again, and next time I'll be waiting.",
      'MARDU': "Take it to whoever's in charge today, and settle it before it festers.",
      'TEMUR': "Let them try building it without me. I'll watch how far they get.",
      'WITCH': "Work out what the credit's worth. If it's less than the fuss, let it go.",
      'GLINT': 'From now on my ideas go straight to the top, with my name on.',
      'DUNE': "Results matter more to me than credit, but they're going to hear about it.",
      'INK': "Maybe they honestly forgot. I'll give them a chance to put it right.",
      'YORE': "Let them have it. I'm already working on what replaces it.",
      'WUBRG': 'Depends who they are. A friend gets a quiet word, a rival gets the evidence.'
    }
  },
  ETHICS: {
    id: 'ETHICS',
    context: "You find out your employer is doing something legal but dodgy. It's profitable, and your bonus depends on it.",
    responses: {
      'MONO-W': "Raise it internally, in writing. Someone should, and it's apparently going to be me.",
      'MONO-U': "Read everything first. I want to know exactly what's at risk before I do anything.",
      'MONO-B': "If it's legal and profitable, it's not my problem. Don't create problems that don't exist.",
      'MONO-R': 'This feels wrong, so I say something, whatever the politics.',
      'MONO-G': 'Keep my own work honest, and trust it to come out in time.',
      'AZORIUS': 'Propose a policy update. If the rules allow this, the rules need fixing.',
      'DIMIR': 'File it with the other things I know and nobody else does.',
      'RAKDOS': "Take the bonus and don't lose sleep. If it blows up, so be it.",
      'GRUUL': "If it stinks, I won't touch it. Someone else can do that bit.",
      'SELESNYA': 'Work out who it hurts, and if anyone, raise it gently with the team.',
      'ORZHOV': "Legal is legal. But I'd quietly make sure I'm not holding it when it explodes.",
      'IZZET': 'Test a cleaner version on a small scale, and bring them the results.',
      'GOLGARI': "It'll collapse eventually. When it does, I'll be there to pick up the useful bits.",
      'BOROS': "Legal doesn't make it less wrong. I'll fight it, in public if I have to.",
      'SIMIC': 'Study why it works. Then find a way to get the same results ethically.',
      'BANT': 'Push for a proper review with the right people and data, however long it takes.',
      'ESPER': 'Put a number on the risk, and stop it if the exposure outweighs the profit.',
      'GRIXIS': "Now I know what this place values when nobody's watching. I'll behave accordingly.",
      'JUND': "It keeps us in work. I'm not risking that for a scruple.",
      'NAYA': "My gut says it's wrong. I'm getting everyone together and making a fuss.",
      'ABZAN': "We'll still be here in ten years, when this comes out. Stop it now.",
      'JESKAI': 'My own work stays clean, whatever they do. Then I make the case to everyone.',
      'SULTAI': 'Learn how it pays, and position myself to gain whichever way it goes.',
      'MARDU': "Pick a side today. Either I'm in on it or I'm at war with it.",
      'TEMUR': 'The market will catch up with this. Get us into whatever replaces it first.',
      'WITCH': "Weigh the legal and money risks calmly, then raise it if they're real.",
      'GLINT': "If nobody's complaining, push it further. Someone else will if we don't.",
      'DUNE': "If it feels wrong, it is. I'd hand my notice in tomorrow.",
      'INK': "Speak up, even if it costs me the job. I'll worry about the mortgage later.",
      'YORE': "Don't patch the rules. Scrap them and design a system where this can't happen.",
      'WUBRG': "How hard I push depends on who it hurts. I'll find that out first."
    }
  },
  MTG_STALL: {
    id: 'MTG_STALL',
    context: "You're 40 minutes into the final game of your store's Commander league. Every board is full, and nobody will attack.",
    responses: {
      'MONO-W': "I'm protecting the player with the smallest board. Whoever attacks them deals with me.",
      'MONO-U': 'Keep my answers ready and wait. The first attacker gives me my opening.',
      'MONO-B': 'I start making quiet offers, one player at a time. Everyone has a price.',
      'MONO-R': "I attack with everything. Something has to happen, and I've decided to be that something.",
      'MONO-G': "I wait. I've been saving mana for 40 minutes. Nobody wants to see it spent.",
      'AZORIUS': 'Propose an open deal with clear terms, and hold everyone to it.',
      'DIMIR': 'I pass, as I have for 40 minutes. Nobody knows my hand ends this.',
      'RAKDOS': "Attack the biggest threat with everything I've got, and enjoy the chaos.",
      'GRUUL': "I don't do politics. Biggest creature, sideways, at whoever's talking most.",
      'SELESNYA': "Keep growing alongside whoever's friendly, and go wide together when it's time.",
      'ORZHOV': "I'm noting who owes whom. When the stall ends, I intend to collect.",
      'IZZET': 'Cast something odd that changes the board, and see who reacts first.',
      'GOLGARI': "I'm fine. While you've stared at your creatures, mine have died and come back stronger.",
      'BOROS': 'Attack the leader, and call on the others to join me.',
      'SIMIC': 'Keep growing my board quietly. Every turn they stall, I get stronger.',
      'BANT': 'Hold back and build. When the table turns on the leader, I join in.',
      'ESPER': 'Count the turns. Waiting favours me, so I wait, and make sure nobody notices.',
      'GRIXIS': "I whisper left: 'Attack right.' I whisper right: 'They're about to attack you. Strike first.'",
      'JUND': 'Knock out the weakest player now. Fewer players, fewer answers.',
      'NAYA': 'Get the table laughing, then lead the charge. Someone always follows.',
      'ABZAN': 'Sit tight with my defences up. Long games are where I win.',
      'JESKAI': 'Work out the exact turn I can win, and play every turn towards it.',
      'SULTAI': "I wait and watch. When someone cracks, I'll pick through the wreckage.",
      'MARDU': 'Enough. I attack now, and back it with everything in hand.',
      'TEMUR': 'I flash in something huge at end of turn. Now everyone has a new problem.',
      'YORE': 'I sacrifice six artifacts to a machine nobody understands. The stall is over.',
      'GLINT': 'Find the most nervous player and lean on them until they move first.',
      'DUNE': 'Attack now. Waiting only lets the decks with answers find them.',
      'INK': 'Offer everyone something to get the game moving, even if it costs me.',
      'WITCH': 'Keep building quietly. In a long game, patience beats everyone at this table.',
      'WUBRG': 'Read the table first, then play the role it needs from me.'
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
    philosophy:"You believe the group matters more than any one person, including you. Rules exist to protect the people who can't argue for themselves, and keeping them sometimes means giving up something you wanted.",
    desc:"You make sure the rules apply to everyone and outlast whoever wrote them. If someone is getting special treatment, you notice and say so.",
    pubBanter:"You bog down every decision with rule-checking and discussions about process and fairness.",
    cmd:'Elesh Norn, Grand Cenobite',
    cmdDesc:'Elesh Norn pumps your creatures by +2/+2 and shrinks everyone else\'s by -2/-2.',
    str:["Will hold a team together past the point most people would have given up.","Sticks to their principles when bending them would be easier.","Builds systems with fair rules.","Lands on decisions that hold up because the process was visibly fair, even when the answer wasn't anyone's favourite."],
    weak:["Will enforce a rule long after the reason for the rule has quietly moved on.","Approaches grey areas looking for the absolutely fair answer.","Persistently underestimates the existence and value of people who don't believe in the rules.","Adapts slowly, and is surprised to find the world has changed without them.","Keeps choosing the fair, slow option when the situation needs speed."],
    roles:'HR Leadership, Master of Ceremonies, Compliance, Ethics, Community Management'
  },
  'MONO-U':{
    name:'MONO-BLUE',
    tag:'Perfection Through Knowledge',
    colors:['U'],
    philosophy:"You believe most decisions get better with more information. Before you commit, you want every question that matters asked and answered, so you're often the last to decide.",
    desc:"You're the person who reads the documentation, then re-reads the bit everyone else skipped. In meetings, the loud people often end up asking you for the answer.",
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
    philosophy:"You believe everyone should be acting in their own interest. Power is what lets you change what happens around you, so you go after it openly.",
    desc:"People around you are often still catching up with a situation you've already read and acted on.",
    pubBanter:"Everything is a calculation about what you get out of it. Look, it's honest, but there isn't a single person in the team who would turn their back on you and not worry about their kidneys.",
    cmd:"K'rrik, Son of Yawgmoth",
    cmdDesc:'K\'rrik lets you pay 2 life instead of black mana, and lifelink heals some of it back.',
    str:["Drives towards outcomes that matter to them, and isn't afraid to break things on the way.","Understands what motivates people and plans around it, without putting their feelings on a pedestal.","Happy to make the calls nobody else wants to make.","Stays focused on the result and is ruthless about getting it."],
    weak:["Assumes everyone else is also running the numbers, and misreads the people who are going on their feelings.","Trust is offered on a thirty-day rolling basis, renewable upon evidence.","Pulls the lever, and is sometimes blind-sided when the people attached to the lever express concern.","Wins quarters in a way that makes the next quarter harder.","Justifies hard calls by saying everyone else would do the same if they were honest about it."],
    roles:'Executive Leadership, M&A, Private Equity, Turnarounds, Restructuring, Corporate Strategy'
  },
  'MONO-R':{
    name:'MONO-RED',
    tag:'Freedom Through Action',
    colors:['R'],
    philosophy:"You believe life is too short for hesitation. When something feels right you act on it now, before anyone has finished planning.",
    desc:"Your gut is sometimes wrong, but acting on it fast usually makes up for that.",
    pubBanter:"Please think for one minute before you set something on fire, because we're tired of sweeping up after you.",
    cmd:'Krenko, Mob Boss',
    cmdDesc:'Krenko taps to make X Goblins where X is the Goblins you already have.',
    str:["Closes the laptop and does the thing while the others are still scheduling the kickoff to discuss discussing the thing.","Whatever it is, they mean it.","Gets things done and brings other people along with them.","Says what they think straight away, before they've had time to soften it.","Will run towards a fire that everyone else is backing away from."],
    weak:["Reads three sentences of the brief and assumes the rest.","Can become very frustrated with lack of action and just blow things up because they're bored.","Leaves a low hum of property damage in their wake.","Runs at full output for six weeks, then is unreachable for a fortnight."],
    roles:'Startups, Sales, Crisis Response, Creative Industries, Frontline Operations, Live Events'
  },
  'MONO-G':{
    name:'MONO-GREEN',
    tag:'Growth Through Acceptance',
    colors:['G'],
    philosophy:"You believe nature got it right the first time. Things that have worked for years usually keep working, and you grow by accepting your place in the larger system.",
    desc:"You trust proven patterns. Updating one takes you a while, but you'll do it when you have to.",
    pubBanter:"Your entire argument against every single change is 'we've always done it this way.'",
    cmd:'Omnath, Locus of Mana',
    cmdDesc:"Omnath doesn't lose green mana as steps and phases end, and grows +1/+1 for each unspent green mana you have.",
    str:["Has been with the company nine years and remembers, without checking, why that policy exists.","Knows the difference between a thing that is broken and a thing that is healing, and will let the second one finish.","Builds processes the way other people build sheds, for weather they have personally seen.","When asked to hurry, moves only as fast as the work can safely go."],
    weak:["Has politely outlasted three reorgs and the people who proposed them.","Treats every new suggestion as an interesting thing happening to other people.","Will let a problem deepen on the theory that it might resolve itself.","The transition was discussed in March, and is still being discussed in October.","Capable of describing 1998 in such detail that the meeting forgets what year it currently is."],
    roles:'Operations, Agriculture, Sustainability, Mentorship, Facilities, Estate Management'
  },
  'AZORIUS':{
    name:'AZORIUS',
    tag:'Order Through Knowledge',
    colors:['W','U'],
    philosophy:"You believe good outcomes come from fair rules, applied carefully and consistently. Good rules let a group think clearly enough to act together, though that makes decisions slower.",
    desc:"You build the process and make sure it applies to everyone equally. Written down properly, it keeps working after you've moved on.",
    pubBanter:"You cite chapter and verse to veto anything fun. Every trivial decision becomes a working group.",
    cmd:'Grand Arbiter Augustin IV',
    cmdDesc:'Your White and Blue spells cost {1} less; opponents\' spells cost {1} more.',
    str:["Will design the process that prevents the specific disaster that happened in 2019 from ever happening again.","Documents the decision and the dissent.","Builds systems in which the wrong answer is structurally hard to reach, even by people trying.","Reads a policy as written and as intended, and can draft a version that works under either reading."],
    weak:["Has prepared a framework for selecting the framework.","Will apply the letter of a rule in an emergency it was never written for.","Wants anything new written up and approved before anyone tries it.","Will arrive at the right decision two weeks after it would have helped.","Confuses 'the rule has been followed' with 'the problem has been solved'."],
    roles:'COO, Compliance, Strategic Planning, Governance, General Counsel, Risk Management'
  },
  'SELESNYA':{
    name:'SELESNYA',
    tag:'Community Through Nature',
    colors:['W','G'],
    philosophy:"You believe people thrive when they belong to something larger than themselves. Communities, like trees, take a long time to grow and longer to repair, so you'll go slowly if it keeps a team together.",
    desc:"You remember everyone's kids' names and which kid is having a hard year. You build the team that, three years in, still likes each other.",
    pubBanter:"Every conflict needs a healing circle and a 1:1 about feelings. Sometimes results matter more than us all liking each other.",
    cmd:"Trostani, Selesnya's Voice",
    cmdDesc:'Whenever a creature enters your battlefield, you gain life equal to its toughness. Tap to populate (create a copy of a creature token you control).',
    str:["Remembers the names of everyone's children and which one is having a hard year, and acts on it.","Builds a team that, three years in, still likes each other.","Will sit with a struggling colleague until the colleague has calmed down.","Finds the version of the plan that nobody has to lose for it to work.","Holds a group together through the kind of week that usually splits it."],
    weak:["Has been workshopping the same difficult conversation, internally, since spring.","Keeps believing that someone who repeats the same mistake will stop, whatever the evidence says.","Mistakes everyone-being-okay-with-this for this-is-going-to-work.","Will keep the underperformer on the team because firing them feels worse than the cost they impose on the team."],
    roles:'Chief People Officer, HR, Culture & Values, Team Leads, Community Programs, Volunteer Coordination'
  },
  'ORZHOV':{
    name:'ORZHOV',
    tag:'Structure Through Power',
    colors:['W','B'],
    philosophy:"You believe structure is the foundation of ambition. A hierarchy keeps things in order, and the people who build and maintain it should do well out of it.",
    desc:"You have a rule-builder's patience and a player's eye for advantage. The hierarchies you build serve the organisation and serve you, and you see no conflict between the two.",
    pubBanter:"You log every favour and enforce policy only when it suits you.",
    cmd:'Obzedat, Ghost Council',
    cmdDesc:'ETB: opponent loses 2, you gain 2. At end step, may exile Obzedat and return at next upkeep with haste.',
    str:["Knows just how to set up bureaucracy that works, and why it's worthwhile doing.","Designs the hierarchy where the right people advance and the merely loud ones politely stall.","Holds the institutional memory, including the parts the institution has been trying to forget.","Can find the budget, and knows who to talk to if there isn't one.","Makes the ambitious version of the plan defensible on paper, then defends it in the meeting."],
    weak:["Tries to balance what is right with what benefits them, and things go wrong fast when the balance tips.","Considers loyalty a four-year vesting schedule, and treats your performance review accordingly.","The favour you accepted in 2022 is now load-bearing in their plan for 2026.","Promotes the deserving and the indebted, and people aren't sure which they are.","People have seen process and policy weaponised often enough to know it could happen to them."],
    roles:'COO, Finance, Legal/Compliance, Senior Management, Estate Planning, Institutional Investing'
  },
  'DIMIR':{
    name:'DIMIR',
    tag:'Intelligence Through Control',
    colors:['U','B'],
    philosophy:"You believe knowledge is the most reliable form of leverage. Most of yours comes from noticing what people leave out, which you keep to yourself until it's useful.",
    desc:"Most of the time you know what everyone in the room is after, but you rarely let on.",
    pubBanter:"You know things and never say how. Getting a straight answer out of you takes three attempts.",
    cmd:"Yuriko, the Tiger's Shadow",
    cmdDesc:'Ninjutsu lets you swap a creature in for one already attacking. Whenever a Ninja you control deals combat damage to a player, reveal the top card of your library and put it into your hand. Each opponent loses life equal to its mana value.',
    str:["Knows what a piece of information is worth and when to use it.","Has spotted three of the last five problems before anyone else noticed they were problems.","Reads the room for what isn't being said, and knows how to weaponise it.","Trades favour for favour without ever calling it that and counts everything.","Adapts faster when the rules change, because they were watching for that already."],
    weak:["Gathers information and favours faster than they can turn them into results.","Everything is an analytical negotiation, even discussing where to go for lunch.","Has been told they're hard to read, and took it as a compliment.","When trust is required quickly, a lifetime of careful information-management becomes a liability.","Carries everyone's secrets and pretends it isn't exhausting."],
    roles:'Strategic Planning, M&A, Competitive Intelligence, VC/PE, Investigative Journalism'
  },
  'IZZET':{
    name:'IZZET',
    tag:'Discovery Through Experimentation',
    colors:['U','R'],
    philosophy:"You believe understanding comes through trying. When an idea arrives you build a rough prototype that week. Most of what you know came from the prototypes that failed.",
    desc:"You're curious about how things work and impatient to test your ideas on something real.",
    pubBanter:"You experimented on production again and now everything's broken. You hand-waved it away as \"an interesting experiment\" and then started working on V2 while customers are yelling at us.",
    cmd:'Niv-Mizzet, Parun',
    cmdDesc:'Can\'t be countered. Whenever you draw a card, deal 1 damage to any target. Whenever a player casts an instant or sorcery spell, you draw a card.',
    str:["Will try the thing that probably won't work, on the chance it does.","Generates more usable ideas in a 20-minute meeting than everyone else in the meeting combined.","Will rebuild a system at 11pm because they thought of a better way at 10:47pm.","Knows the spec well enough to find the bit where the spec is lying."],
    weak:["Has three projects in flight, and one of them is quietly on fire.","Loses interest exactly when the idea has to become a thing anyone else can use.","Documentation is a problem for next quarter.","Underestimates how much other people value something that works, however badly.","Will solve the wrong problem brilliantly."],
    roles:'R&D, Innovation Labs, Product Development, Startups, Quant Research'
  },
  'GRUUL':{
    name:'GRUUL',
    tag:'Power Through Instinct',
    colors:['R','G'],
    philosophy:"You believe modern busy life overcomplicates everything. The fancy new approach is usually the old one with extra steps. So you trust your gut and use what has already worked.",
    desc:"When a plan stops working, you're the one the team sends in. You fix it with methods you already trust, often before anyone has agreed a new plan.",
    pubBanter:"You smash through everything and ignore feedback. Someone else always ends up apologising to the people you flattened.",
    cmd:'Borborygmos Enraged',
    cmdDesc:'Whenever Borborygmos deals combat damage to a player, reveal the top three cards: lands go to your hand, the rest to your graveyard. Discard a land card: 3 damage to any target.',
    str:["Calls the question when everyone else is still negotiating which question to call.","Will not pretend the meeting was useful when it wasn't.","Brings energy into a stalled room.","Knows when the answer is 'just do it' and is correct more often than is comfortable.","The kind of teammate who is on the work and gone the moment it's done."],
    weak:["Has been heard saying 'this is just process for the sake of process' about laws or processes that matter.","Will burn down the agenda when given enough latitude.","Treats nuance as someone else's job, which is fine until they're the only one in the room.","Can be promoted into roles where 'just do it' is the wrong instinct.","Confuses 'I dealt with that quickly' with 'I dealt with that well'."],
    roles:'Operations, Sales, Construction, Military, Crisis Response, Frontline Trades'
  },
  'RAKDOS':{
    name:'RAKDOS',
    tag:'Freedom Through Chaos',
    colors:['B','R'],
    philosophy:"You believe rules are mostly for people too afraid to live. If you want something you take it and live with the consequences.",
    desc:"Nobody has to guess what you want, because you go after it openly. You also do what you say you'll do.",
    pubBanter:"You treat every meeting like a comedy set, while the rest of us pick up the balls you dropped.",
    cmd:'Rakdos, Lord of Riots',
    cmdDesc:'Creature spells you cast cost {1} less for each life your opponents have lost this turn. Can\'t be cast unless an opponent has lost life.',
    str:["Will say the thing in the meeting that everyone was thinking but nobody planned to say.","Catches the meeting that has lost its purpose and either blows it up or helps it find a new, usually more interesting one.","Reliable in a crisis precisely because crises are when their instincts and the situation finally line up.","Treats company-line phrases with suspicion.","Doesn't pretend to be someone they aren't."],
    weak:["Gets bored during a stable, successful stretch and starts causing trouble.","Has been described as 'lots of fun' and 'somehow the reason we lost two team members' in the same review.","Will undermine an institution they need, on principle, then be surprised it's gone.","Makes jokes at moments that needed someone to be serious.","Confuses sincerity in others with stuffiness."],
    roles:'Disruptive Startups, Aggressive Sales, Entertainment, Activism, Creative Direction'
  },
  'GOLGARI':{
    name:'GOLGARI',
    tag:'Growth Through Decay',
    colors:['B','G'],
    philosophy:"You believe nothing is wasted. Endings and failures are part of how things grow. Letting something die when its time has come doesn't trouble you.",
    desc:"You're patient and clear about your own interests. When a project dies, you keep whatever is still useful from it. People come to you after a failure, or when they want to understand the long game.",
    pubBanter:"Everything is a metaphor about cycles of life with you. Sometimes things just need to work today.",
    cmd:'Meren of Clan Nel Toth',
    cmdDesc:'Whenever another creature you control dies, get an experience counter. At end step, return a creature from your graveyard with mana value ≤ experience.',
    str:['Can sense when initiatives or projects are dead or dying, even when they don\'t know it yet.','Will keep failing initiatives on life support exactly long enough to harvest the useful bits.','Has seen this crisis before, and already knows roughly when it ends.','Refuses to throw out the old code, and will need it eventually.'],
    weak:['Will happily let a project die because dying is, in some sense, the point.','Spent eighteen months telling everyone the strategy was rotting from the inside, and didn\'t try to fix it.','Has a folder labelled \'might be useful in three years\' that contains everything from the last five years.','Mistakes \'something new will arise from this eventually\' for \'I have therefore handled the problem\'.','Doesn\'t ever seem to create anything new.'],
    roles:'Sustainability, Turnaround/Restructuring, Operations, Insolvency Practice'
  },
  'SIMIC':{
    name:'SIMIC',
    tag:'Evolution Through Design',
    colors:['G','U'],
    philosophy:"You believe evolution doesn't stop and shouldn't be expected to. Anything can be improved the way nature improves things, one small, careful change at a time.",
    desc:"You improve things gradually and on purpose, adjusting what's there until, two years on, nobody remembers the original.",
    pubBanter:"You optimise everything to death. In six months you'll have shipped at 95%, but no-one will have a job because the product was meant to ship six months ago.",
    cmd:'Prime Speaker Vannifar',
    cmdDesc:'Tap and sacrifice a creature: search for a creature with mana value exactly 1 more, put it onto the battlefield.',
    str:["Builds the version they wanted, two iterations after the version everyone settled for.","Notices the small system changes that make an incremental difference, and knows how to implement them.","Understands how processes and systems change over time, and tends them like a careful gardener.","Will rework the inherited process slightly better every quarter, until two years later it's much better and entirely different.","Has a clear personal standard of 'finished' that's higher than almost anyone else's."],
    weak:["Struggles to ship something they consider unfinished, even when 'unfinished' means 'one paragraph short on the docs'.","Improves things that were not the bottleneck.","Holds the team to the bar in their head, which is mostly higher than the bar in anyone else's head.","Suspicious of 'good enough' as a moral position, even when good enough is the correct call.","Has, at least once, made a process so robust that nobody outside it understood it."],
    roles:'Product Management, Process Improvement, Biotech, UX Research, Platform Engineering'
  },
  'BOROS':{
    name:'BOROS',
    tag:'Justice Through Action',
    colors:['R','W'],
    philosophy:"You believe some things are worth fighting for. When something matters to you, you act on it straight away and give it everything you have.",
    desc:"A loyal team usually follows you, because you're quick to act on what you believe.",
    pubBanter:"You treat quarterly planning like D-Day. Months on, the intensity is exhausting. Relax for one minute and stop talking about the greater good.",
    cmd:'Aurelia, the Warleader',
    cmdDesc:'Whenever Aurelia attacks for the first time each turn, untap all your creatures and gain an additional combat phase.',
    str:['Will run at the problem while everyone else is still considering whether a meeting about it might be a good idea.','Gets a team behind a cause and keeps it there until the job is done.','Names things that are unfair or wrong where others might shy away.','Commits to the work as if losing it would mean something.','Good in a crisis, and someone people trust to solve things well.'],
    weak:['Struggles not to reach for the hammer when something feels wrong or unfair.','Treats \'we could just send an email\' as a form of moral cowardice.','Can\'t quite tell the difference between a difficult conversation and a battle, and tends to err in favour of the second.','Hears that something unfair may have happened and is already out of their seat, before it has been verified.','Has a list of people who are with us and a list of people who are not with us or are a wrong\'un.'],
    roles:'Military, Crisis Management, Mission Nonprofits, Sales Leadership'
  },
  'BANT':{
    name:'BANT',
    tag:'Harmony Through Structure',
    colors:['W','U','G'],
    philosophy:"You believe civilisation, knowledge, and patience all matter, and that most people pick one and pretend the other two are nice-to-haves. Keeping all three in balance takes time, which you're prepared to spend.",
    desc:"You run the meetings where every voice is heard and the decision is one we can all live with five years out.",
    pubBanter:"You need three rounds of consultation and a stakeholder map to decide where to go for lunch, and it's already 3pm.",
    cmd:'Rafiq of the Many',
    cmdDesc:'Whenever a creature you control attacks alone, it gets +1/+1 (exalted) and double strike.',
    str:['Holds analysis, fairness, and timing in one mental model and rarely drops any of them.','Builds strategies that a team will own, because everyone helped build them.','Plans for where the team needs to be in four years, and builds fair things that will last that long.','Can create a psychologically safe space where people feel supported.'],
    weak:['Puts team cohesion and accuracy ahead of results.','Believes a well-run process can prevent conflict.','Struggles in a crisis, when things are needed fast and no good option exists.','Mistakes "the data supports it and we agreed" for "this is going to work".','Avoids difficult conversations.'],
    roles:'Executive Leadership in slow-growth sectors, Strategic HR, Educational Leadership, Policy Development'
  },
  'ESPER':{
    name:'ESPER',
    tag:'Perfection Through Control',
    colors:['W','U','B'],
    philosophy:"You believe optimal outcomes need fair systems, deep analysis, and the willingness to make the call. Once the analysis is done you make that call yourself, whether or not people agree.",
    desc:"You're rarely the warmest person in the room. Your decisions are often still holding up after six months of pressure, and people learn to rely on them.",
    pubBanter:"Every conversation with you is like talking to a spreadsheet.",
    cmd:'Sharuum the Hegemon',
    cmdDesc:'When Sharuum enters, return a target artifact card from your graveyard to the battlefield.',
    str:['Keeps the org chart and the budget in mind at once.','Made the move that mattered four quarters ago, when nobody noticed.','Builds systems which make it easy for the right answer to end up being the path of least resistance.','Understands why bureaucracy is needed and how to use it to help their team.','Is able to understand and name trade-offs and make the right decision dispassionately.'],
    weak:['Finds the best answer on paper and doesn\'t expect the people it affects to be upset.','Wants the fair frameworks they design to work in their own favour.','Can struggle to take action in unclear, information-poor situations such as a crisis.','Relies on quiet influence when a bit of loud energy would get things done faster.','Refers to colleagues by what they do and what they\'re worth to the team.'],
    roles:'CFO/Finance, Chief Compliance Officer, Strategic Operations, Management Consulting'
  },
  'GRIXIS':{
    name:'GRIXIS',
    tag:'Power Through Ruthless Action',
    colors:['U','B','R'],
    philosophy:"You believe intelligence, ambition, and aggression compound. Together they get you the outcomes you want, and being disliked along the way doesn't bother you.",
    desc:"You read a situation faster than most and act on it before anyone has had time to object.",
    pubBanter:"There is never a calm day with you around. If a meeting isn't adding value, the pin on the grenade gets pulled.",
    cmd:'Nekusar, the Mindrazer',
    cmdDesc:'Whenever an opponent draws a card, Nekusar deals 1 damage to them.',
    str:['Calls the move before everyone else has finished diagramming the board, and is usually right.','Reads which way something will move three weeks before it folds, and is already positioned ready to go.','Almost always able to adjust faster than the situation through prediction and action.','Is happy to name the cost out loud and to pay it.','Builds ruthlessly effective teams that deliver.'],
    weak:['Has used "it\'s just business" to describe something that was, by any honest reading, slightly personal.','Spends people\'s trust quickly once they\'ve earned it.','Can burn people out.','Optimises hard and leaves the ongoing problems for other people to deal with.','Believes pressure improves people, and is sincerely puzzled when colleagues leave for somewhere with less of it.'],
    roles:'Turnaround CEO, Competitive Strategy, High-Stakes Trading, Private Equity'
  },
  'JUND':{
    name:'JUND',
    tag:'Survival Through Hunger',
    colors:['B','R','G'],
    philosophy:"You believe survival rewards the hungry and the adapted. You trust the instincts that got you this far. Whatever isn't working, you cut loose before it drags you down.",
    desc:"You're at your best when a competitor shows up and there's something to fight for.",
    pubBanter:"With you, every meeting becomes a forum to push and every project a fight you intend to win.",
    cmd:'Prossh, Skyraider of Kher',
    cmdDesc:'When you cast Prossh, create X 0/1 Kobolds where X is the mana spent. Sacrifice another creature: Prossh gets +1/+0 until end of turn.',
    str:['Will go for the throat of the project nobody else wanted to fight.','Treats "this is hard" as a description and carries on.','Will set a target nobody believes in, then hit it, partly out of spite.','Names who\'s in charge and what they want, which most rooms had agreed not to mention.','Has been through three layoffs and is still here.'],
    weak:['Leaves the long-term cost of how they got here to whoever comes next.','Built a pace nobody else can hold and can\'t see why the team doesn\'t keep up.','Has explained, with a straight face, that the people who left "weren\'t built for this".','Believes nuance is what people do when they don\'t have a clear answer.','Is high-performing, but people are slightly afraid of them.'],
    roles:'Aggressive Sales, Competitive Industries, Startups, Sports, Private Equity'
  },
  'NAYA':{
    name:'NAYA',
    tag:'Power Through Community',
    colors:['R','G','W'],
    philosophy:"You believe strength comes from a community aligned with natural purpose. For you, everything starts with a team that turns up. You've worked hard to build one, and you ask a lot of it.",
    desc:"People work harder on a plan you're behind, and believe in it more.",
    pubBanter:"You bring pep talks and a marching band to every task, including updating a spreadsheet.",
    cmd:'Samut, Voice of Dissent',
    cmdDesc:'Your creatures have haste. Tap: untap another creature.',
    str:['Walks into a stalled room and the room remembers what it was doing.','Can turn a group of strangers into a committed team within a few weeks.','Knows everyone and has had drinks with everyone.','Starts projects nobody else thought were worth starting, and makes them work.','The earnestness is real, and other people\'s irony bounces off it.'],
    weak:['Treats the third hour of the Tuesday call with the same energy as the first ten minutes.','The big speech was on Wednesday, and the follow-up big speech is on Thursday.','Believes the more interesting and fairer idea wins, which is almost always untrue.','Has so much enthusiasm for the work that quieter colleagues can\'t get a word in to say where it should point.','Leaves the detail to other people.'],
    roles:'Startups, Marketing, Politics, Sales, Event Planning, Community Building'
  },
  'ABZAN':{
    name:'ABZAN',
    tag:'Endurance Through Tradition',
    colors:['W','B','G'],
    philosophy:"You believe lasting power comes from patience, pragmatism, and community held together over decades. Your effort goes into things that will still matter in ten years, and the rest gets cut.",
    desc:"You build things that are still standing in 2034 because they were built by someone who remembers 2014. You know who can be counted on and who can't.",
    pubBanter:"You block every new idea and keep a ledger of favours going back decades.",
    cmd:'Karador, Ghost Chieftain',
    cmdDesc:'Costs {1} less for each creature card in your graveyard. May cast a creature from graveyard each turn.',
    str:['Builds things designed to still be standing in 2034, and largely succeeds, because they were designed by someone who remembers 2014.','Has outlasted four CEOs and one merger.','Judges a plan by whether it will still be working in five years.','Knows who can be counted on in specific weather.','Has carried the organisation through its worst years.'],
    weak:['Has patiently explained why each new system won\'t work, and has been right twice and wrong four times.','Promotes the loyal ahead of the deserving.','Has kept a pilot programme in pilot since 2019.','Still holds a comment from the 2017 offsite against someone in every staffing decision.','Has built a system in which everyone owes someone else a favour.'],
    roles:'Family Businesses, Legal, Traditional Industries, Politics'
  },
  'JESKAI':{
    name:'JESKAI',
    tag:'Excellence Through Discipline',
    colors:['U','R','W'],
    philosophy:"You believe excellence comes from disciplined practice applied with passion and held within principles. That means putting in long hours, which you consider a fair price for being good at something.",
    desc:"Years of practice have made you very good at several things. If someone asks how, you'll explain the method step by step.",
    pubBanter:"You roll your eyes at our approach constantly, because apparently everything we do is basic.",
    cmd:'Narset, Enlightened Master',
    cmdDesc:'When Narset attacks, exile the top four cards. You may play non-creature cards exiled this way.',
    str:['Has put in the hours on three different things and is world-class at all of them.','Catches the moral quandary in the position that no one else saw, and fixes it.','Plays the move three turns ahead, then explains why the previous turn was the point of leverage.','Demonstrates the standard by doing it.','Able to switch from the prepared plan to the live read mid-action, without showing the gear-change.'],
    weak:['Cannot quite hide that they think the room is, on average, beneath them.','Forgets that the basics had to be learned, and has ruined a kickoff by starting with the advanced version.','Treats people who haven\'t put in their hours as a regrettable but tolerable feature of the workplace.','Will redo the work that was already correct because it could have been more correct.','Mentors well, but only people whose questions they find interesting.'],
    roles:'Consulting, Teaching, Professional Services, Strategy'
  },
  'SULTAI':{
    name:'SULTAI',
    tag:'Growth Through Exploitation',
    colors:['B','G','U'],
    philosophy:"You believe patient analysis and strategic positioning beat aggressive haste. You study how things change over time and get into position early, so you can take value out slowly and quietly.",
    desc:"You keep a patient, careful record of who holds what.",
    pubBanter:"You're slimy. Somehow everyone's work ends up as part of your little empire.",
    cmd:'Sidisi, Brood Tyrant',
    cmdDesc:'When Sidisi enters or attacks, mill 3. Whenever creature cards hit your graveyard from your library, create a 2/2 zombie.',
    str:['Plays the eight-quarter game, in which the first six quarters look like nothing is happening.','Was already in the right meeting before anyone knew which meeting was going to be the right one.','Knows what every person at the table has to give, and what they think they\'re giving.','Has regularly been described as "helpful" by people who haven\'t quite yet noticed what they\'re being helped towards.','Has been planning this since the previous restructure.'],
    weak:['Helps improve a colleague\'s idea, then presents it as part of their own plan.','Needs to be in the room where the conversation is happening, or have someone in there.','Has done several things that, taken together, would make an outside observer raise an eyebrow.','Waits so long for a certain win that good chances pass them by.','Is rarely the person someone would name as a close friend.'],
    roles:'Private Equity, VC, Corporate Development, Real Estate'
  },
  'MARDU':{
    name:'MARDU',
    tag:'Victory Through Sacrifice',
    colors:['R','W','B'],
    philosophy:"You believe decisive action within a clear hierarchy wins. You lead from the front and set a fast pace. People do burn out, and you take that seriously while the work carries on.",
    desc:"The team moves at your speed, and anyone who can't keep up gets left behind.",
    pubBanter:"Every deadline is life or death with you, and you treat burnout as a sign of commitment. Those of us still here are exhausted.",
    cmd:'Alesha, Who Smiles at Death',
    cmdDesc:'Whenever Alesha attacks, pay {W/B}{W/B}: return a creature card with power 2 or less from graveyard, tapped and attacking.',
    str:['Owns the call and doesn\'t relitigate it after the fact.','Gets calmer as the stakes go up.','Knows who needs to be told what, and in which order.','Delivers the result, even on a deadline others have given up on.','Holds firm when everyone else is giving way.'],
    weak:['Treats months of hard work as a warm-up.','Is proud of the people who "gave everything" and doesn\'t ask where they are now.','The costs of getting the win never make it onto the same slide as the win.','Only slows down between Christmas and the second of January.','Looks around after a successful quarter and is briefly surprised by how few of the original team are still in the room.'],
    roles:'Turnarounds, Crisis Management, Sales, Founding Teams, Competitive Markets'
  },
  'TEMUR':{
    name:'TEMUR',
    tag:'Power Through Adaptation',
    colors:['G','U','R'],
    philosophy:"You believe wild creativity and raw power combine best when guided by understanding. Each new problem probably needs a different approach from the last one. You drop an old method as soon as it stops fitting.",
    desc:"You change your approach as the situation shifts, usually sooner than the people around you.",
    pubBanter:"We're constantly adapting to whatever idea pounced out of you this week. We've stopped trying to predict you.",
    cmd:'Surrak Dragonclaw',
    cmdDesc:"Neither Surrak nor your creatures can be countered, and your other creatures have trample.",
    str:['Will sketch the new approach in the meeting and build the prototype that night.','Comes up with the angles that nobody else thought of.','Has a new idea most mornings, and some of them turn out to be right.','Stays calm in a chaotic situation.','Will try the thing nobody got permission to try.'],
    weak:['Has been on the same project for six weeks and rewritten the foundations three times.','Changes the plan between Monday and Wednesday.','Believes all plans at all stages are a starting point.','The team has, collectively, stopped scheduling anything more than two weeks out.','Starts changing things as soon as work settles down.'],
    roles:'Startups, Innovation, R&D, Creative Industries'
  },
  'WITCH':{
    name:'FOUR-COLOR (No Red)',
    tag:'Perfection Without Passion',
    colors:['W','U','B','G'],
    philosophy:"You believe sustainable success comes from patience, analysis, and quiet positioning. You don't see what passion adds, and you're happy to wait for the right answer.",
    desc:"You're the person whose plans are still working in three years. You take urgent requests calmly and decide whether they need any action at all.",
    pubBanter:"We threw you a surprise party once, mostly as an experiment. You thanked us and asked whether the budget had come from contingency.",
    cmd:"Atraxa, Praetors' Voice",
    cmdDesc:'Proliferate at end step: add a counter of any kind already on a permanent or player.',
    str:['Holds analysis, fairness, ambition, and patience without any of them outweighing the others.','Builds the strategy that compounds over years.','Wins long arguments by turning up to every meeting until the other side stops coming.','Reads situations without the emotional component clouding the analysis.','Makes the right move early and doesn\'t need the credit.'],
    weak:['Has no internal alarm for a closing window, so good chances pass while the analysis matures.','Can seem so detached that colleagues wonder whether they care about the work.','Dismisses passionate ideas as "inefficient" without considering whether the passion was load-bearing.','Treats joy and energy as variables that don\'t usefully feature in any equation worth running.','Has more than once watched a crisis unfold and analysed it correctly without doing anything.'],
    roles:'Operations, Finance, Strategy, Long-term Planning, Sovereign Wealth, Patient Capital'
  },
  'YORE':{
    name:'FOUR-COLOR (No Green)',
    tag:'Innovation Without Nature',
    colors:['W','U','B','R'],
    philosophy:"You believe progress comes from transcending what's already there. Tradition is useful to you as information. The smart, ambitious team you've built around you helps you find what comes next.",
    desc:"You build complex systems and rebuild any part that doesn't quite fit, including parts that still work.",
    pubBanter:"You over-engineer everything. Every solution needs seventeen moving parts that'll need emergency fixes in two weeks.",
    cmd:'Breya, Etherium Shaper',
    cmdDesc:'When Breya enters, create two 1/1 thopter tokens. Then pay {2} and sacrifice two artifacts for various effects: 3 damage to a player or planeswalker, -4/-4 to a creature, or gain 5 life.',
    str:['Will deliver the thing that didn\'t exist yesterday, and treats this as the baseline.','Holds the thirteen-part architecture in their head and updates it mid-flight.','Has usually thought three steps past where everyone else stopped, and is impatient for them to catch up.','Will work late because the work isn\'t right yet.','Doesn\'t trust the manual process to stay correct, and quietly builds the automation that catches the human error before the human notices.'],
    weak:['Turns the grocery list into a system.','If the solution is short, the problem must have been wrong.','Has built a personal velocity that\'s incompatible with most human bodies, including their own.','Rebuilds things that were correct the first time.','Can\'t leave things alone, and the team\'s energy goes into keeping up with the changes.'],
    roles:'Tech Startups, Engineering Leadership, R&D, Disruption, FinTech, Founders'
  },
  'GLINT':{
    name:'FOUR-COLOR (No White)',
    tag:'Power Without Morality',
    colors:['U','B','R','G'],
    philosophy:"You believe effectiveness matters more than the rules of the room. In your experience most \"ethics\" are someone protecting their position and calling it principle. When a rule only serves the person who made it, you work around it.",
    desc:"You have no strong loyalty to the group, so the lines other people stay inside don't hold you.",
    pubBanter:"Apparently rules are for suckers, and you hijack projects for fun and leave smoking wreckage everywhere. We never know what you're going to do next.",
    cmd:'Yidris, Maelstrom Wielder',
    cmdDesc:'When Yidris deals combat damage, spells you cast this turn have Cascade. Cascade means when you cast a spell, exile cards until you hit one with lower mana value, then cast that for free.',
    str:['Will try a move that\'s technically against the rules if that\'s the only thing stopping it from working.','Closes the deal that needed closing, without checking who else should have been on the call.','Routes around new constraints as if they were part of the terrain.','Knows which rules can be broken and what it will cost.','Will tear down an architecture two people built their reputations on if it stops working.'],
    weak:['Treats "is this okay?" as a question for someone else\'s department.','Makes commitments in good faith and drops them when the situation changes.','The project they touched is now thirty percent better and forty percent on fire.','By the third quarter, the rest of the team has learned to work around them.','Has usually moved to a different role at a different company by the time the consequences arrive.'],
    roles:'Disruption, High-Risk Ventures, Competitive Industries, Distressed Asset Acquisition, Activist Investing'
  },
  'DUNE':{
    name:'FOUR-COLOR (No Blue)',
    tag:'Action Without Analysis',
    colors:['W','B','R','G'],
    philosophy:"You believe action reveals truth faster than analysis. Overthinking looks to you like fear of being wrong, so you move fast and fix your mistakes as you go.",
    desc:"You commit on instinct and figure things out in motion, skipping the analysis that would slow you down.",
    pubBanter:"You charge in on instinct every time. By the time we've picked up the pieces from the last impulse, you're three impulses ahead.",
    cmd:'Saskia the Unyielding',
    cmdDesc:'As Saskia enters, choose a player. Damage your creatures deal to a player is also dealt to the chosen player.',
    str:['Cuts through the meeting that was about to go around the table for a third time.','Acts on the mood of the room before anyone has said it out loud.','Arrives with the kind of energy that means something is about to happen.','Has a team that will follow them anywhere.','Gets things shipped without waiting for every question to be answered.'],
    weak:['Will dismiss the analysis as "analysis paralysis" before the analysis has finished its first sentence.','Treats the plan as something that happens to other people.','Has shipped the thing on Tuesday and is fixing the thing on Wednesday.','Doesn\'t trust an answer that needed a spreadsheet.','Leaves other teams to clean up after them.'],
    roles:'Sales, Operations, Crisis Response, Military, Frontline Leadership, Field Operations'
  },
  'INK':{
    name:'FOUR-COLOR (No Black)',
    tag:'Altruism Without Pragmatism',
    colors:['W','U','R','G'],
    philosophy:"You believe progress comes from serving something larger than yourself. You're proud that you've never exploited anyone, though it has sometimes left you holding the bill.",
    desc:"You help people and build things that serve others, and what's in it for you rarely comes up.",
    pubBanter:"You're trying to help everyone at once and it's a circus.",
    cmd:'Kynaios and Tiro of Meletis',
    cmdDesc:'At your end step, you draw a card. Each player may put a land from hand onto the battlefield, then each opponent who skips the land draws a card.',
    str:['Believes the work can be both useful and good.','Plans across community, ideas, energy and growth.','Walks into the cynical room and the cynicism quietly excuses itself for the rest of the meeting.','Holds the door open for the people the rest of the org has stopped noticing.','Finds the angle that helps everyone, partly by not considering whether anyone should be helped less.'],
    weak:['Cannot quite believe that some of the people in the room are optimising for themselves.','Has twice been used as the cover story for someone else\'s plan, and is being lined up for a third time.','Has three good causes in flight and none of them has a clear scope.','Assumes everyone is trying their best.','Gives the win to the room and keeps ending up under-credited.'],
    roles:'Nonprofits, Education, Community Building, Social Enterprise, Cooperative Movement, Mission-Driven Leadership'
  },
  'WUBRG':{
    name:'FIVE-COLOR',
    tag:'Chaos or Mastery',
    colors:['W','U','B','R','G'],
    philosophy:"You believe every approach has its place. You read the situation first, then pick the approach that fits it.",
    desc:"You can draw on every approach, which makes you either a Renaissance person or a generalist who hasn't picked one yet.",
    pubBanter:"You put the kitchen sink into every project. We are taking bets on which spinning plate crashes first.",
    cmd:'Kenrith, the Returned King',
    cmdDesc:'Five colours at once, with every angle available.',
    str:['Can take the technical role on Monday and the people role on Tuesday.','Holds five different framings of the problem at once, and the right one surfaces eventually.','Sees the same situation from analysis, ambition, structure, instinct, and patience in the same breath.','Speaks five different professional dialects fluently, and switches between them mid-sentence without noticing.','Notices what each of the other identities would notice.'],
    weak:['Holds five priorities and gives each one twenty percent of the energy.','Is the second-best person in the room at nearly everything.','Cannot quite answer \'what do you believe\' without first asking what kind of room they\'re in.','Three years of running everything has produced a CV that, read cold, looks like five different people\'s CVs glued together.'],
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
