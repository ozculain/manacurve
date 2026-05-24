// data.js — bulk data constants extracted from mana_v4.html in Phase F.
// Loaded via <script src="data.js"></script> before the main inline script in
// mana_v4.html. Non-module script scope means these constants are visible to
// the inline script that follows.
//
// To re-inline these for any reason, paste each block back into the original
// location in mana_v4.html (look for the "moved to data.js" marker comments).

// ROUND2_SCENARIOS
const ROUND2_SCENARIOS = {
  CRISIS: {
    id: 'CRISIS',
    context: 'A critical project is failing and the deadline is in 48 hours. How do you react?',
    responses: {
      'MONO-W': 'Rally together, follow the emergency protocols, ensure nobody is left struggling alone.',
      'MONO-U': 'Pause everything. Analyse the root cause. Design a patch before touching anything.',
      'MONO-B': 'Cut the failing features. Ship a stripped-down win. Sentiment is not a deliverable.',
      'MONO-R': 'Scrap the plan! All-nighter! Brute-force a solution with pure energy!',
      'MONO-G': 'Stay the course. Panic causes errors. Rely on experience to see us through.',
      'AZORIUS': 'Comprehensive audit of what failed. Fair, systematic correction. Filed by end of day.',
      'DIMIR': 'Analyse quietly. Hide the worst flaws. Position the narrative so we still look successful.',
      'RAKDOS': "This is a disaster so let's burn the schedule and execute a high-risk pivot immediately.",
      'GRUUL': 'Trust your gut! Ignore the data, smash the obstacles, power through with raw effort!',
      'SELESNYA': "The team is the priority. If we support each other and stay calm, we'll fix this together.",
      'ORZHOV': "We'll fulfil our obligations, but ruthlessly prioritise resources. Leadership survives this.",
      'IZZET': 'Excellent, a challenge! Rapidly prototype three crazy solutions. See which one explodes least.',
      'GOLGARI': 'Accept this iteration is dead. Recycle what works and grind out a sustainable version 2.0.',
      'BOROS': 'General quarters! Everyone focused. Disciplined. Attacking this problem. NOW.',
      'SIMIC': "Adapt. Study the bug and evolve the code incrementally until it's stronger than before.",
      'BANT': 'Structured, sustainable defence. Protect the team, analyse the data, advance methodically.',
      'ESPER': 'Control the damage. Implement a strict logical framework. Extract the best possible outcome.',
      'GRIXIS': 'Stop whining. Find the weak point. Exploit every shortcut. Force a solution by any means.',
      'JUND': 'Survival of the fittest. The weak ideas die now. We hunt for the solution with aggression.',
      'NAYA': 'Rally the tribe! Passion, strength, and unity to overcome this together!',
      'ABZAN': 'Endurance is key. Dig in, rely on structures, outlast the crisis through sheer persistence.',
      'JESKAI': 'Discipline meets creativity. A brilliant, lightning-fast strategy executed with martial precision.',
      'SULTAI': "Don't panic. Analyse the decay, utilise resources efficiently, turn failure into long-term advantage.",
      'MARDU': 'Strike now! Fast coordinated attack on the problem. Casualties acceptable. Failure is not.',
      'TEMUR': 'Assess the threat. Then strike with overwhelming force. Adapt and overcome.',
      'WITCH': 'Cold, calculated, inclusive systematic review. No heroics. Just process.',
      'GLINT': 'Chaos reigns. Use every tool, every trick, every risk to survive. No rules anymore.',
      'DUNE': 'Stop thinking and start working. Action, unity, and grit. Not analysis.',
      'INK': "Solve this together in a way that helps everyone, even if we miss the deadline. Integrity first.",
      'YORE': 'The old ways failed. Radical artificial restructuring of the project. Immediately.',
      'WUBRG': 'Data analysis, team unity, pragmatic resource management, decisive action, and historical context. All of it.'
    }
  },
  CONFLICT: {
    id: 'CONFLICT',
    context: "Two people you work with are fighting fiercely over a decision. How do you intervene?",
    responses: {
      'MONO-W': 'Stop fighting. There are rules for this. Reference the handbook.',
      'MONO-U': "You're both being irrational. Present your data and the logical answer will reveal itself.",
      'MONO-B': "I don't care who's right. I care who brings results. Figure it out or you're both gone.",
      'MONO-R': 'Let it out! Yell, scream, get the emotion on the table. Then we hug and move on.',
      'MONO-G': 'Give it time. Tensions rise and fall. It will resolve itself naturally.',
      'AZORIUS': 'Formal tribunal. Each side presents evidence. I issue a binding judgment.',
      'DIMIR': 'Speak to both privately. Learn their angles. Engineer a quiet resolution before it goes public.',
      'RAKDOS': 'Fight! A little competition is good. Winner takes the project.',
      'GRUUL': 'Stop talking and arm wrestle for it. Strongest conviction wins.',
      'SELESNYA': "Sit in a circle. Find consensus. We don't move until we all agree.",
      'ORZHOV': 'What is the debt owed? Negotiate a settlement where everyone pays their due.',
      'IZZET': "Both of you are wrong! I have a third, weirder idea. Let's do that instead!",
      'GOLGARI': 'This conflict is wasteful. One of you should step down so the other can thrive.',
      'BOROS': 'Stand down! Get back in line. The mission is more important than your egos.',
      'SIMIC': 'Combine your ideas. The hybrid solution will be stronger than either one alone.',
      'BANT': 'Mediate a solution that is fair, logical, and sustainable for the group.',
      'ESPER': "I've calculated the outcome. This discussion is over. Here is the optimal path.",
      'GRIXIS': "Both of you put your strongest case on the table. The argument that holds up gets the budget — let the disagreement do the filtering.",
      'JUND': 'Let them fight. It purges weakness from the team.',
      'NAYA': "We're a family! Respect the hierarchy, but put your heart into the work.",
      'ABZAN': 'Respect the seniority. The one with the most tenure and loyalty decides.',
      'JESKAI': 'Use this conflict to sharpen your minds. Debate until the perfect truth is forged.',
      'SULTAI': "I'll watch and wait. When one of you falters, I'll replace you.",
      'MARDU': "Decide now. We're moving too slow. I don't care which path. Just pick one.",
      'TEMUR': 'Which path survives the harsh conditions? Do that.',
      'WITCH': 'Committee review to ensure objective fairness. No emotions.',
      'GLINT': "Rules don't matter. Who wants it more? Take it.",
      'DUNE': 'Stop overthinking. Just do the work and stop whining.',
      'INK': 'How can we solve this so nobody loses face?',
      'YORE': 'Tradition is irrelevant. Which idea is smarter?',
      'WUBRG': "I'll listen to the feelings, the data, the ambitions, the rules, and the wisdom. Then I'll decide."
    }
  },
  PIVOT: {
    id: 'PIVOT',
    context: "You're offered a risky new role that matches your passion but offers less security. Do you take it?",
    responses: {
      'MONO-W': "I need to discuss this with my family first. I can't leave them in a bad spot.",
      'MONO-U': "I need to see the business plan. If the data proves viability, I'll transition logically.",
      'MONO-B': "Passion doesn't pay rent. I'll take it only if I get significant equity.",
      'MONO-R': "YES. My current job is suffocating me. I'm handing in my notice today!",
      'MONO-G': "I'm hesitant. I have deep roots here. I prefer to grow where I'm planted.",
      'AZORIUS': "I'll draft a transition plan. Smooth handover, secure contract, then maybe.",
      'DIMIR': "I'll take the interview. Use the offer as leverage for a raise at my current job.",
      'RAKDOS': "I'm bored anyway. If it crashes, I'll find another one. Let's ride.",
      'GRUUL': "I hate wearing a tie. I'm quitting to go do something real with my hands.",
      'SELESNYA': "If the new culture is supportive and I can bring my people, I'll go.",
      'ORZHOV': 'Calculate the exact risk-to-reward ratio. If the prestige is higher, I accept.',
      'IZZET': 'A startup? High risk? Total chaos? Sign me up immediately!',
      'GOLGARI': "My current career is dead. Time to shed this skin and start the next cycle.",
      'BOROS': "Is the mission righteous? If the cause is good, I'll march into hell for it.",
      'SIMIC': "This role requires skills I don't have. I'll take it to evolve my capabilities.",
      'BANT': 'Build a safety net first. Once my security is organised, I pursue the noble path.',
      'ESPER': 'Re-negotiate the contract. I want the passion role with the security clauses I dictate.',
      'GRIXIS': "Take the job. Learn everything I can. Use it to build something that's actually mine.",
      'JUND': "I hunger for a challenge. I'll leave the herd to hunt alone.",
      'NAYA': 'My heart says go. I trust my instinct and my community to catch me if I fall.',
      'ABZAN': "I'm building a legacy. Does this secure my family's future for twenty years?",
      'JESKAI': "To master my craft, I must challenge myself. I'll leap with disciplined focus.",
      'SULTAI': "I'll wait. The right offer surfaces when the people noticing me have actually seen what I do.",
      'MARDU': 'Fortune favours the bold. Seize the opportunity before someone else takes it.',
      'TEMUR': 'Does the new environment let me be free? If yes, I go.',
      'WITCH': 'A calculated risk. The growth potential validates the move. Emotions not consulted.',
      'GLINT': "I'm doing it for me. I don't care if I leave my current team in the lurch.",
      'DUNE': "Stop analysing the contract. It feels right. I'm doing it.",
      'INK': "The money doesn't matter. I just want to do work that helps people.",
      'YORE': "The past is irrelevant. I'm reinventing myself completely.",
      'WUBRG': 'I seek a path that balances security, growth, passion, intellect, and ambition.'
    }
  },
  MISTAKE: {
    id: 'MISTAKE',
    context: "You've made a serious error that cost real money or time. How do you handle it?",
    responses: {
      'MONO-W': 'I apologise. Accept the consequences. Work overtime to make it right for the team.',
      'MONO-U': "Here's a report on the systemic flaw that allowed the error, and a patch to fix it.",
      'MONO-B': 'Minimise the fallout. Frame it as a cost of doing business. Move on.',
      'MONO-R': "My bad! I messed up! I'll fix it right now with my own two hands!",
      'MONO-G': "We all make mistakes. Part of the learning process. I won't make it again.",
      'AZORIUS': 'Self-report filed with compliance. New protocol drafted to prevent recurrence.',
      'DIMIR': "Let the dust settle before saying anything. Speak only once I know what's actually been pieced together.",
      'RAKDOS': "Laugh it off! If you aren't breaking things, you aren't moving fast enough.",
      'GRUUL': "Own it. I broke it. I'm strong enough to deal with the heat.",
      'SELESNYA': 'Ask the group for help. Together we repair the damage.',
      'ORZHOV': "What's the fine? I'll pay the debt and consider the matter settled.",
      'IZZET': "Whoops! Interesting result though. Let's try the inverse and see if that fixes it!",
      'GOLGARI': 'Bury the failure. Let it rot. Build something better on top of the compost.',
      'BOROS': 'I take full responsibility! I accept disciplinary action and will correct course!',
      'SIMIC': "An error is just data. I'll update my internal algorithm to account for this.",
      'BANT': 'Protect the team from fallout while implementing a structured fix.',
      'ESPER': "Control the narrative. Explain why this was actually a calculated stress test.",
      'GRIXIS': "Reframe it. The error is real, but the story I tell about it determines what happens next.",
      'JUND': "Survival is all that matters. I'll fight anyone who tries to fire me over this.",
      'NAYA': "I'm ashamed, but I'll use that emotion to fuel my redemption.",
      'ABZAN': "I'll endure the criticism. My loyalty and track record will protect me.",
      'JESKAI': 'This failure is a lesson in discipline. I must perfect my technique.',
      'SULTAI': "Assess the damage honestly. If recovery isn't viable, I'd rather pivot early than go down with a doomed plan.",
      'MARDU': "Attack the problem! Don't dwell on mistakes. Charge forward to the solution.",
      'TEMUR': 'The plan failed. Instinctively shift to a new path. Adapt.',
      'WITCH': 'Systematic failure requires process revision, not emotional apologies.',
      'GLINT': "It happened. Deal with it. I'm not apologising for trying to win.",
      'DUNE': "Don't give me a lecture. Just tell me what I need to do to fix it.",
      'INK': "I'm so sorry. I'll do whatever it takes so nobody else gets in trouble.",
      'YORE': "Rewrite the history. As far as the system's concerned, this error never happened.",
      'WUBRG': 'Acknowledge the error, understand the cause, accept the cost, feel the regret, grow from it.'
    }
  },
  BURNOUT: {
    id: 'BURNOUT',
    context: "You're overwhelmed, exhausted, and have too many responsibilities. What do you do?",
    responses: {
      'MONO-W': "I can't let the team down. I'll keep working until the job is done.",
      'MONO-U': 'Optimise my workflow. If I automate these three tasks, I regain control.',
      'MONO-B': 'Drop the lowest-value tasks immediately. I only focus on what benefits me.',
      'MONO-R': "I'm done! Mental health day before I scream at someone.",
      'MONO-G': 'Disconnect. A walk in nature will restore my energy.',
      'AZORIUS': 'File a formal request for additional resources. Prioritise tasks by deadline.',
      'DIMIR': 'Outsource the work secretly without telling anyone.',
      'RAKDOS': "Party hard. If I'm going to burn out, I'm having fun doing it.",
      'GRUUL': "Smash the schedule! I'm refusing all meetings until I can think straight.",
      'SELESNYA': 'Ask my community for help. We share the burden so no one breaks.',
      'ORZHOV': 'Call in my favours. Everyone who owes me a debt helps me now.',
      'IZZET': "More caffeine! More speed! I can sleep when I'm dead!",
      'GOLGARI': 'Hibernate. Bare minimum to survive until my energy returns.',
      'BOROS': 'Push through the pain! Fatigue is just weakness leaving the body.',
      'SIMIC': 'Bio-hack my physiology. Better diet and sleep cycles will improve efficiency.',
      'BANT': 'Structure creates peace. Organise the chaos and lean on my support network.',
      'ESPER': 'Delegate everything. I become the architect, not the bricklayer.',
      'GRIXIS': 'Burn the candle at both ends. Ambition and adrenaline will power through.',
      'JUND': 'Grind. I will outwork everyone because I am stronger than them.',
      'NAYA': 'I draw strength from my purpose. If I believe in the work, I have endless energy.',
      'ABZAN': 'Endure. We have weathered worse. Keep walking.',
      'JESKAI': 'A disciplined mind does not feel fatigue. Find the flow state.',
      'SULTAI': 'Resource management. I will consume whatever is necessary to keep going.',
      'MARDU': 'Sprint to the finish! We rest after the victory, never before.',
      'TEMUR': 'Retreat to the wild. I need solitude to recharge.',
      'WITCH': 'Schedule every minute. Emotion is inefficient.',
      'GLINT': 'I quit the tasks I hate. Let someone else deal with the boring stuff.',
      'DUNE': 'Just keep working. Thinking about how tired I am only makes it worse.',
      'INK': "I'm tired because I'm helping everyone else. I need to set boundaries.",
      'YORE': 'I need a new system. The old way of working is obsolete.',
      'WUBRG': 'Balance is lost. I must realign my body, mind, soul, ambitions, and duties.'
    }
  },
  BETRAYAL: {
    id: 'BETRAYAL',
    context: "A close friend or colleague you trusted has taken credit for your idea in a public setting. Everyone saw it. How do you respond?",
    responses: {
      'MONO-W': 'Raise it formally. There should be a process for this, and it should apply to everyone equally.',
      'MONO-U': 'Document everything. Build an undeniable paper trail. Then present it to the right person.',
      'MONO-B': 'Note it. Say nothing now. Use this leverage later when I need something from them.',
      'MONO-R': 'Confront them. Right now. In front of everyone. This is not something I swallow.',
      'MONO-G': 'Let it go. The truth surfaces eventually. People who matter already know.',
      'AZORIUS': 'File a formal objection. The system exists to handle this. Use it.',
      'DIMIR': 'I document quietly. When this comes up again — and it will — the receipts will be ready.',
      'RAKDOS': 'Make a scene. If they want the spotlight, I\u2019ll make sure it burns.',
      'GRUUL': 'I tell them to their face. Loudly. I don\u2019t do politics.',
      'SELESNYA': 'Talk to them privately. Assume good intent. Repair the relationship.',
      'ORZHOV': 'They now owe me. I\u2019ll collect when the time is right.',
      'IZZET': 'Doesn\u2019t matter\u2014I\u2019ve already moved on to three better ideas.',
      'GOLGARI': 'Ideas die and get reborn. This one will come back to me eventually.',
      'BOROS': 'This is a matter of honour. I address it directly and demand correction.',
      'SIMIC': 'Interesting data point about their character. I adapt my trust model accordingly.',
      'BANT': 'Address it through proper channels with evidence. Protect the relationship if possible.',
      'ESPER': 'I\u2019ve already cc\u2019d leadership on the original document. This resolves itself.',
      'GRIXIS': 'I won\u2019t forget. They\u2019ve shown me how this relationship works, and I\u2019ll act accordingly when it matters.',
      'JUND': 'Weak move. I confront them and make sure everyone sees who backs down first.',
      'NAYA': 'Rally my people. Truth and loyalty will win. The community knows who I am.',
      'ABZAN': 'My track record speaks for itself. I\u2019ll outlast this. And I\u2019ll remember.',
      'JESKAI': 'Channel the anger into proving the next idea is even better. Excellence is the best revenge.',
      'SULTAI': 'I say nothing. I wait. Their pattern will repeat. Next time, I\u2019ll be positioned.',
      'MARDU': 'Swift justice. I correct the record publicly and move on to the next battle.',
      'TEMUR': 'Shrug it off. Ideas are cheap. Execution is what matters, and I execute better.',
      'WITCH': 'Process the situation systematically. Escalate through proper channels. No emotional reaction.',
      'GLINT': 'The rules just changed. I\u2019m playing the new game, not the one I thought we were in.',
      'DUNE': 'I don\u2019t need credit. I need results. But they\u2019re going to hear about it.',
      'INK': 'Give them the benefit of the doubt. Maybe they genuinely forgot. Talk it out.',
      'YORE': 'Irrelevant. The idea is already obsolete. I\u2019m three versions ahead.',
      'WUBRG': 'Assess motives, gather evidence, consider relationships, feel the anger, then respond proportionally.'
    }
  },
  ETHICS: {
    id: 'ETHICS',
    context: "You discover your employer is doing something technically legal but ethically questionable. It\u2019s profitable and no one has complained. What do you do?",
    responses: {
      'MONO-W': 'Raise it internally. Just because it\u2019s legal doesn\u2019t make it right. Standards matter.',
      'MONO-U': 'Research the full implications. Understand the risk exposure before deciding how to act.',
      'MONO-B': 'If it\u2019s legal and profitable, it\u2019s not my problem. Don\u2019t create problems that don\u2019t exist.',
      'MONO-R': 'This feels wrong. I say something. I don\u2019t care about the politics.',
      'MONO-G': 'These things have a way of coming to light on their own. Nature corrects.',
      'AZORIUS': 'Propose a policy update. If the rules allow this, the rules need fixing.',
      'DIMIR': 'Useful information. I store it. It may prove valuable later.',
      'RAKDOS': 'Who cares? Rules are for people who can\u2019t handle the grey area.',
      'GRUUL': 'If it stinks, call it out. I don\u2019t do complicated moral calculations.',
      'SELESNYA': 'Think about who gets hurt. If people are affected, we need to talk about it.',
      'ORZHOV': 'Legal is legal. But I\u2019d quietly position myself to not be holding this when it explodes.',
      'IZZET': 'Fascinating ethical puzzle! Let me map out every possible consequence tree.',
      'GOLGARI': 'Everything rots eventually. If this is unsustainable, it\u2019ll collapse. I\u2019ll be ready.',
      'BOROS': 'This is wrong and I will fight it. Legality is not morality.',
      'SIMIC': 'Study it. Understand why it works. Then find a way to achieve the same results ethically.',
      'BANT': 'Build a case. Present it fairly. Propose a better path that works for everyone.',
      'ESPER': 'Quantify the risk. If exposure exceeds profit, it\u2019s irrational to continue.',
      'GRIXIS': 'Useful information. I now understand what this company values when no one\u2019s watching, and that changes how I navigate it.',
      'JUND': 'Survival doesn\u2019t care about ethics. If it keeps us alive, I look away.',
      'NAYA': 'My gut says this is wrong. I trust that feeling. Time to make some noise.',
      'ABZAN': 'Consider the long game. Reputation is an asset. Protect it.',
      'JESKAI': 'There\u2019s a principled path and I\u2019m going to find it. Excellence includes ethics.',
      'SULTAI': 'Note it. Hold it. Information like this is only useful once I understand its context \u2014 acting too early wastes the leverage.',
      'MARDU': 'Pick a side. Act. I\u2019m either in or I\u2019m going to war. No fence-sitting.',
      'TEMUR': 'Does this align with reality? If the market or the world will punish this, act early.',
      'WITCH': 'Systematic risk assessment. Personal feelings about ethics are irrelevant to the analysis.',
      'GLINT': 'Ethics are a luxury for people not trying to survive. I focus on what\u2019s real.',
      'DUNE': 'If it feels wrong, it is wrong. I don\u2019t need a philosophy degree to know that.',
      'INK': 'Speak up, even if it costs me. Some things are more important than a job.',
      'YORE': 'The ethical framework is outdated. Propose a modern standard that actually works.',
      'WUBRG': 'Consider the rules, the data, the consequences, the feelings, and the precedent. Then decide.'
    }
  },
  MTG_STALL: {
    id: 'MTG_STALL',
    context: "You're in a competitive game (could be cards, board game, whatever). It's stalled for 40 minutes. Everyone has strong positions. Nobody wants to make the first move. Everyone is just... waiting.",
    responses: {
      'MONO-W': "I propose a formal rotation. Clockwise attacks. Everyone gets a turn. It's only fair.",
      'MONO-U': "I'm fine. Every draw step brings me closer to inevitability. You'll all understand eventually.",
      'MONO-B': 'I start making offers. Quietly. One by one. Someone at this table has a price.',
      'MONO-R': "I attack. Into the full board. With everything. I will lose creatures. I don't care. SOMETHING HAS TO HAPPEN.",
      'MONO-G': "I wait. The board will resolve itself. I've been playing creatures for 40 minutes. I can play creatures for 40 more.",
      'AZORIUS': "I've drafted a non-binding resolution for structured aggression. Section 3 covers reparations. Please review.",
      'DIMIR': "I pass. I've been passing for 40 minutes. What I haven't told anyone is that I've been sculpting a hand that ends this in one turn.",
      'RAKDOS': "I attack the player who's having the most fun. The game is boring and now they should be bored too.",
      'GRUUL': "I ATTACK. They block? I don't care. Board goes sideways? GOOD. THINGS ARE HAPPENING.",
      'SELESNYA': "I suggest we all just... talk. Why are we fighting? The real treasure was the friends we\u2014",
      'ORZHOV': 'I start taking notes on who owes whom. This stall will end eventually. I intend to collect.',
      'IZZET': "What if I just... cast this? I don't know what it does. Let's find out together.",
      'GOLGARI': "I'm fine. While you've been staring at your creatures, mine have been dying and coming back stronger.",
      'BOROS': "COWARDS. ALL OF YOU. Fine. I'll break this stall MYSELF. CHARGE.",
      'SIMIC': "I've been quietly putting +1/+1 counters on things. Don't mind me. Keep stalling. Please.",
      'BANT': 'Temporary alliance against whoever has the strongest board. Democratically. Ranked choice voting.',
      'ESPER': "The optimal play is to wait. I've calculated that in 7 turns, the board favours me by 23%.",
      'GRIXIS': "I whisper left: 'Attack right.' I whisper right: 'They're about to attack you. Strike first.'",
      'JUND': "I attack the weakest player. Not because they're a threat. Because culling the herd is natural.",
      'NAYA': "I rally the table. 'We're all friends! Let's just attack and see what happens! It'll be FUN!'",
      'ABZAN': "I've been here before. Stalls end. Players make mistakes. I outlast. Time is on my side.",
      'JESKAI': "I've calculated exactly who should attack whom for optimal damage. Here's a diagram. You're welcome.",
      'SULTAI': "I wait. And watch. Someone will crack. When they do, I'll pick through the wreckage.",
      'MARDU': "Enough. I'm attacking you. Why? Because you're THERE.",
      'TEMUR': "The board is a puzzle. Let me just... *turns all creatures sideways* THERE. Now it's a different puzzle.",
      'YORE': 'I have 17 artifacts. You have creatures. Let me explain why this ends in my favour. Do you have three hours?',
      'GLINT': "The person to my right looks nervous. I'm going to stare at them until they crack.",
      'DUNE': "I stop thinking. I attack. Strategy is for people who don't have enough power.",
      'INK': "What if we all just attacked at once? Same time? No takebacks? Beautiful chaos.",
      'WITCH': "I've been advancing incrementally for 40 minutes. I can do this for 40 more. Can you?",
      'WUBRG': "I have answers. I have threats. I have a plan. I have a backup plan. I'm fine. Are you fine? You don't look fine."
    }
  }
};

// COMMANDER_ORACLE
const COMMANDER_ORACLE = {
  // MONO-COLOR
  'Elesh Norn, Grand Cenobite': {
    cost: '{4}{W}{W}{W}',
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
    text: ['When Obzedat enters, target opponent loses 2 life and you gain 2 life.', 'At the beginning of your end step, you may exile Obzedat. If you do, return it to the battlefield under your control at the beginning of your next upkeep. It gains haste.']
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
    cost: '{3}{R}{G}{W}',
    pt: '3/4',
    text: ['Flash', 'Double strike, vigilance, haste', 'Other creatures you control have haste.', '{W}: Untap another target creature.']
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
    philosophy:"You believe the group matters more than any one person, including you. Rules exist to protect the people who can't argue for themselves. Sometimes that means giving up something you actually wanted, and you've made your peace with that — most of the time.",
    desc:"You're the person who makes sure the rules exist, the rules apply to everyone, and the rules survive whoever wrote them. The group runs better with you in it. Most of the time the group doesn't notice.",
    pubBanter:"You bog down every decision with rule-checking and discussions about process, equity and fairness. Can we just call it already? Yeah, you're right about the rules, which is annoying in itself. You're generally nice enough not to mention it.",
    cmd:'Elesh Norn, Grand Cenobite',
    cmdDesc:'Elesh Norn pumps your creatures by +2/+2 and shrinks everyone else\'s by -2/-2. The system protects its own and weakens the rest — a literal example of "the rules apply differently depending on which side of them you\'re on." White at its most authoritarian.',
    str:["Will hold a team together past the point most people would have given up — and sometimes past the point they should have.","Has actual principles, which can be very disconcerting in a work context.","Builds systems with fair, just and reasonable rules.","Lands on decisions that hold up because the process was visibly fair, even when the answer wasn't anyone's favourite.","Builds things that outlast their author. Sometimes intentionally."],
    weak:["Will enforce a rule long after the reason for the rule has quietly moved on.","Approaches grey areas looking for absolute just and fair approaches. Life sometimes isn't that simple.","Persistently underestimates the existence and value of people who simply don't believe in the rules.","The rules are the rules -- can tend to adapt slowly. Can be mildly surprised when the world has moved on without them.","Will pick 'fair but slow' over 'fast, imperfect and unequal' every time. Including times when speed matters and there isn't time for perfection."],
    roles:'HR Leadership, Master of Ceremonies, Compliance, Ethics, Community Management'
  },
  'MONO-U':{
    name:'MONO-BLUE',
    tag:'Perfection Through Knowledge',
    colors:['U'],
    philosophy:"You believe most decisions get better with more information. You read the whole document, sometimes twice. You ask the third question that nobody else thought to ask. You'd rather be the last person to commit than the first one to be wrong, and you've made your peace with the cost of that. Understanding things and being right works!",
    desc:"You're the person who reads the documentation. Actually reads it. Then re-reads the bit everyone else skipped. In meetings you're rarely the loudest, but you're often the person the loud people end up asking for the answer.",
    pubBanter:"Always 'well, actually' before any decision. Can we just decide already? In three weeks you'll come back with a thoroughly argued treatise explaining how you were right all along and we'll all know it but the world will have moved on.",
    cmd:'Urza, Lord High Artificer',
    cmdDesc:'Urza is the Blue archetype: figure out the optimal solution, build the engine to execute it, run the engine. Tap-an-artifact-for-blue-mana plus impulse-draw activated ability are both "if I\'m smart enough, the cost goes away" moves.',
    str:["Loves and understands the detail.","Finds the assumption nobody questioned and questions it, gently. Particularly on Tuesdays.","Models the system three layers deeper than the meeting required, which is why everyone ends up using their models.","Updates their position when the evidence updates. Doesn't make a thing of it. Notices when other people don't. Judges.","Treats being wrong as new information, not a personal injury. Genuinely. Not performatively."],
    weak:["Will spend a week optimising the decision that needed an afternoon. The answer is correct. The crisis has ended and the house has burnt down.","Mistakes 'I can see how you might feel that' for an adequate emotional response.","Considers fifteen edge cases before lunch and has not yet addressed the actual case.","Quietly grades the room. The room can tell.","When asked to pick without enough data, freezes. Properly freezes."],
    roles:'Strategy, Research, Analytics, Architecture, Policy Analysis, Forecasting'
  },
  'MONO-B':{
    name:'MONO-BLACK',
    tag:'Power Through Agency',
    colors:['B'],
    philosophy:"You believe everyone should be acting in their own interest. You're just one of the few who do it effectively. Power isn't evil — it's the ability to shape the world. It is, occasionally, why people stop returning your calls, but you've factored that in.",
    desc:"Pragmatic self-interest and the willingness to make hard calls. You see the reality of the situation faster than the people around you. Most of the discomfort in the room is them catching up.",
    pubBanter:"Everything is a calculation about what you get out of it. Look, it's honest, but there isn't a single person in the team who would turn their back on you and not worry about their kidneys.",
    cmd:"K'rrik, Son of Yawgmoth",
    cmdDesc:'K\'rrik lets you pay 2 life instead of black mana, and lifelink heals some of it back. The whole point is to play through the cost faster than anyone else can. The cleanest Black-philosophy card Magic has: everything has a price, pay it, win.',
    str:["Drives towards outcomes that matter to them, and isn't afraid to break things on the way to achieving that.","Understands emotions, but doesn't place peoples feelings on a pedestal.","Understands what motivates people. Doesn't moralise about it. Plans around it.","Happy to make calls that few others want to have made.","Ruthless and focused on achieving outcomes and results."],
    weak:["Tends to assume everyone else is also running the numbers. Some of them are running their feelings.","Trust is offered on a thirty-day rolling basis, renewable upon evidence.","Sees the lever, pulls the lever, and is sometimes blind-sided when the people attached to the lever express concern.","Wins quarters in a way that makes the next quarter harder. Has noticed. Has prioritised this quarter.","Will explain, kindly, that everyone is doing this — they're just doing it on purpose."],
    roles:'Executive Leadership, M&A, Private Equity, Turnarounds, Restructuring, Corporate Strategy'
  },
  'MONO-R':{
    name:'MONO-RED',
    tag:'Freedom Through Action',
    colors:['R'],
    philosophy:"You believe life is too short for hesitation. Authentic action beats the perfect plan. Feel it, do it, and let the version of you that exists later sort out the consequences. They've done it before. They'll do it again.",
    desc:"Authentic expression, immediate action. You trust your gut. The gut is sometimes wrong, but the speed compensates more often than not.",
    pubBanter:"Could you please think about things for a minute before you set something on fire? Cleaning up the messa afterwards is getting tiring.",
    cmd:'Krenko, Mob Boss',
    cmdDesc:'Krenko taps to make X Goblins where X is the Goblins you already have. The mechanic doubles every turn it works. The whole strategy is commit early, lean in, and produce more momentum than anyone can answer. Red as compound impulse.',
    str:["Closes the laptop and does the thing while the others are still scheduling the kickoff to discuss discussing the thing.","Means it. Whatever it is, they mean it. This is rarer than it sounds and harder to fake.","Is very effective at getting something done, and helping others get on the \"let's get things done\" band-wagon.","Says things without thinking which are regularly things other people were thinking.","Will volunteer to set the fire. Or to run towards the fire. Has, on balance, probably put out more fires than they started."],
    weak:["Reads three sentences of the brief and assumes the rest.  Sometimes this goes badly wrong.","Can become very frustrated with lack of action and just blow things up because they're bored.","Leaves a low hum of property damage in their wake — desks, processes, occasionally a sister team's roadmap.","Runs at full output for six weeks, then is unreachable for a fortnight, and refers to this as 'pacing'.","Answered the personality test honestly and instinctively, which it was not, strictly speaking, designed for."],
    roles:'Startups, Sales, Crisis Response, Creative Industries, Frontline Operations, Live Events'
  },
  'MONO-G':{
    name:'MONO-GREEN',
    tag:'Growth Through Acceptance',
    colors:['G'],
    philosophy:"You believe nature got it right the first time. What works, works. Growth comes from accepting your place in the larger system instead of fighting against it. This is, mostly, true. The part you don't always say out loud is that quite often it's also restful.",
    desc:"Natural growth, patience, respect for what works. You trust proven patterns. Proven patterns occasionally need updating. You can do that, it just sometimes takes a while.",
    pubBanter:"They resist. every.. single... change. Their entire argument is 'we've always done it this way.' We have, on three occasions, ignored you. On one of those occasions you were actually right. We do not mention this to you.",
    cmd:'Omnath, Locus of Mana',
    cmdDesc:"Omnath doesn't lose green mana as steps and phases end, and grows +1/+1 for each unspent green mana you have. The card mechanically rewards patience and accumulation. Green's compound-interest philosophy made literal.",
    str:["Has been with the company nine years and remembers, without checking, why that policy exists.","Knows the difference between a thing that is broken and a thing that is healing. Will let the second one finish. Will let the first one just sit for a bit in case it is also healing.","Builds processes the way other people build sheds — for weather they have personally seen.","When asked to move quickly, moves at exactly the speed that allows the work to survive being moved.","Is not lazy. Is waiting for the correct season."],
    weak:["Has politely outlasted three reorgs, two strategies, and the people who proposed them.","Treats every new suggestion as an interesting thing happening to other people.","Will let a problem deepen on the theory that it might resolve itself, which, twice out of ten, it did.","The transition was discussed in March. It is now October. The transition is being discussed.","Capable of describing 1998 in such detail that the meeting forgets what year it currently is."],
    roles:'Operations, Agriculture, Sustainability, Mentorship, Facilities, Estate Management'
  },
  'AZORIUS':{
    name:'AZORIUS',
    tag:'Order Through Knowledge',
    colors:['W','U'],
    philosophy:"You believe good outcomes come from fair rules, applied carefully and consistently. Rules aren't constraints — they're the structure that lets a group think clearly enough to act together. The cost is that careful collective thinking takes a while. You think it's worth it, and you've been mostly right about that.",
    desc:"You build the process, document it, schedule the review, and make sure it applies to everyone equally. The system tends to outlast whoever set it up, which is the design intent. It's not exciting and you're rarely thanked. You don't need to be.",
    pubBanter:"You cite chapter and verse to veto anything fun. Every trivial decision becomes a working group. Yeah, one time we skipped the working group, the office caught fire. Doesn't mean it was related and doesn't mean you have to bring it up every meeting.",
    cmd:'Grand Arbiter Augustin IV',
    cmdDesc:'Your White and Blue spells cost {1} less; opponents\' spells cost {1} more. The bureaucracy IS the battlefield advantage — the side that built the system has the advantage. The Azorius thesis in five lines of rules text.',
    str:["Will design the process that prevents the specific disaster that happened in 2019 from ever happening again.","Documents the decision, the reasoning, and the dissent. The dissent is acknowledged.","Builds systems in which the wrong answer is structurally hard to reach, even by people trying.","Reads the policy as written, then as intended, and can produce a version that survives both readings.","Azorius doesn't enjoy meetings. Azorius IS meetings."],
    weak:["Has prepared a framework for selecting the framework. The selection meeting is on Thursday. There is pre-reading. Checks whether the pre-reading is done","Subsection 4(b)(ii) clearly states the kitchen is for staff only. The fire department, regrettably, is not staff. Get out!","Treats 'we could just try it' as a category of moral injury.","Will arrive at the right decision two weeks after it would have actually helped.","Confuses 'the rule has been followed' with 'the problem has been solved'. They're sometimes the same thing. Not always."],
    roles:'COO, Compliance, Strategic Planning, Governance, General Counsel, Risk Management'
  },
  'SELESNYA':{
    name:'SELESNYA',
    tag:'Community Through Nature',
    colors:['W','G'],
    philosophy:"You believe people thrive when they belong to something larger than themselves. Communities — like trees — take a long time to grow and longer to repair when damaged. Your job is to tend, not to force. You'd rather have the slow team that holds together than the fast team that doesn't.",
    desc:"You remember everyone's kids' names and which kid is having a hard year. You build the team that, three years in, still likes each other. That outcome is rare and shouldn't be undersold. You'd never undersell it. You'd also never call it that.",
    pubBanter:"Can we fire anyone? Ever? Every conflict needs healing circle and patience and a 1:1 about feelings. Sometimes getting results matters more than us all liking each other, right?",
    cmd:"Trostani, Selesnya's Voice",
    cmdDesc:'Whenever a creature enters your battlefield, you gain life equal to its toughness. Tap to populate (create a copy of a creature token you control). The card mechanically rewards growth-by-accumulation and protects the group while doing it. Selesnya: the team gets bigger, the team gets healthier.',
    str:["Remembers the names of everyone's children and which one is having a hard year. Acts on the information.","Builds a team that, three years in, still likes each other. This is not normal and shouldn't be undersold.","Will sit with a struggling colleague long enough that the colleague's nervous system actually arrives.","Finds the version of the plan that nobody has to lose for it to work. Occasionally, that version exists.","Holds the room together during the kind of week that historically dissolves rooms."],
    weak:["Has been workshopping the same difficult conversation, internally, since spring.","Believes, with a faith that survives all evidence, that the person who keeps doing the thing will stop doing the thing.","Mistakes everyone-being-okay-with-this for this-is-going-to-work","Will keep the underperformer on the team because firing them feels worse than the cost they impose. The team is paying the cost.","The offsite has been extended. The offsite is now a retreat. The retreat is now four weeks long and involves hugs."],
    roles:'Chief People Officer, HR, Culture & Values, Team Leads, Community Programs, Volunteer Coordination'
  },
  'ORZHOV':{
    name:'ORZHOV',
    tag:'Structure Through Power',
    colors:['W','B'],
    philosophy:"You believe structure isn't the opposite of ambition — it's the foundation of it. Systems should reward the people who maintain them. Hierarchy creates order, order creates opportunity, and the people who built the hierarchy should benefit from the order they built. You don't think this is sinister. You think it's honest about how institutions work and incentivises people to do their best work.",
    desc:"You combine the rule-builder's patience with the player's eye for advantage. The hierarchy serves the organisation AND it serves you. You don't see why those two things would be in tension, and you've spent a career proving they aren't.",
    pubBanter:"Every favour gets logged. Every policy gets enforced selectively. You always end up holding the ledger of who owes whom. The ledger has been correct, to the cent, for eleven years. That's the part that's terrifying.",
    cmd:'Obzedat, Ghost Council',
    cmdDesc:'ETB: opponent loses 2, you gain 2. At end step, may exile Obzedat and return at next upkeep with haste. The institution literally phases out when threatened and phases back in when convenient. Orzhov\'s strategic patience in one mechanic.',
    str:["Knows just how to set up bureaucracy that works, and why it's worthwhile doing.","Designs the hierarchy where the right people advance and the merely loud ones politely stall.","Holds the institutional memory, including the parts the institution has been trying to forget.","Can find the budget. There is always a budget. They made sure there was a budget and know who to talk to if there isn't.","Makes the ambitious version of the plan defensible on paper, then defends it on paper and in the meeting."],
    weak:["Tries to balance what is right with what is personally valuable. If the balance tips, things go sideways fast.","Considers loyalty a four-year vesting schedule. Will treat your performance review accordingly.","The favour you accepted in 2022 is now load-bearing in their plan for 2026.","Promotes or supports the deserving AND the indebted and people aren't sure which they are. Or know they are both.","People have seen enough situations where process or policy was weaponised in ways they felt uncomfortable to know it could happen to them."],
    roles:'COO, Finance, Legal/Compliance, Senior Management, Estate Planning, Institutional Investing'
  },
  'DIMIR':{
    name:'DIMIR',
    tag:'Intelligence Through Control',
    colors:['U','B'],
    philosophy:"You believe knowledge is the most reliable form of leverage. You watch carefully. You note what people say AND what they don't. The best moves are the ones nobody saw coming, including, sometimes, you. You've learned not to give your information away cheaply.",
    desc:"You're rarely the loudest person in the room. You're often the one who knows what everyone is actually after. You don't share that lightly. You'd rather know more than be known, and you've made a career of the difference.",
    pubBanter:"Why do you know that? Why won't you tell us what you know? Not every conversation is a negotiation. It's exhausting!",
    cmd:"Yuriko, the Tiger's Shadow",
    cmdDesc:'Ninjutsu lets you swap a creature in for one already attacking — sneaky, unannounced. Whenever a ninja attacks, reveal the top card of your library and deal damage equal to its mana value. Damage delivered through information you\'ve controlled. The Dimir thesis in one mechanic.',
    str:["Knows things. Knows that other people know they know things. Knows that that's currency.","Has spotted three of the last five problems before anyone else noticed they were problems.","Reads the room for what isn't being said. Knows how to weaponise that.","Trades favour for favour without ever calling it that and counts everything.","Adapts faster when the rules change, because they were watching for that already."],
    weak:["Knowledge and favours are only as good as your ability to use them to get results.","Everything is an analytical negotiation... even discussing where to go for lunch.","Has been told they're hard to read. Has interpreted this as a compliment.","When trust is required quickly, a lifetime of careful information-management becomes a liability.","Carries everyone's secrets. This is exhausting in ways they pretend it isn't."],
    roles:'Strategic Planning, M&A, Competitive Intelligence, VC/PE, Investigative Journalism'
  },
  'IZZET':{
    name:'IZZET',
    tag:'Discovery Through Experimentation',
    colors:['U','R'],
    philosophy:"You believe understanding comes through trying. You'd rather build the prototype that probably doesn't work than wait six months for the design that definitely won't. Speed and curiosity together produce more usable knowledge than either does alone. Most of your failed experiments are how you learned the things your peers are still arguing about.",
    desc:"You combine analytical curiosity with experimental urgency. You will try the thing nobody got permission to try, learn what happens, and have built v2 by Wednesday. Your colleagues are sometimes alarmed. They are usually impressed though.",
    pubBanter:"Did you test this? At all? You experimented on production again and now everything's broken and you hand-waved it away as \"an interesting experiment\" and then started working on V2 while customers are yelling at us.",
    cmd:'Niv-Mizzet, Parun',
    cmdDesc:'Can\'t be countered. Whenever you draw a card, deal 1 damage to any target. Whenever you\'re dealt damage, draw a card. The two abilities form a literal closed loop — every input becomes an output, every output becomes an input. The Izzet engine made into a card.',
    str:["Will try the thing that probably won't work, on the chance it does. It does, often enough.","Generates more usable ideas in a 20-minute meeting than everyone else in the meeting combined.","Treats failure as data the way other people treat tea — frequent, mildly bracing, part of the day.","Will rebuild a system at 11pm because they thought of a better way at 10:47pm.","Knows the spec well enough to find the bit where the spec is lying."],
    weak:["Three projects in flight, two more being prototyped, one quietly on fire.","Loses interest exactly when the idea has to become a thing anyone else can use.","Documentation is a problem for next quarter. Next quarter is also a problem for next quarter.","Underestimates how much joy other people derive from things working slightly ineffectively but still working.","Will solve the wrong problem brilliantly, which is somehow worse than not solving it at all."],
    roles:'R&D, Innovation Labs, Product Development, Startups, Quant Research'
  },
  'GRUUL':{
    name:'GRUUL',
    tag:'Power Through Instinct',
    colors:['R','G'],
    philosophy:"You believe modern busy life overcomplicates everything. Trust your gut. Use what's already worked. The fancy new approach is usually the old approach with extra steps that didn't need adding. When in doubt, hit it harder. When still in doubt, hit it harder than that.",
    desc:"You combine instinct with the things that have already worked. The result is action that nobody planned but everyone recognises afterwards. You're the team's stopgap when the plan stops working — which is more often than the plan would have you believe.",
    pubBanter:"Subtlety? Strategy? Never heard of them. You smash through everything and ignore feedback. Six months of subtle people had already gotten nowhere, which is why we called you. You came, did the thing, broke a desk. Why did you break the desk!?!?",
    cmd:'Borborygmos Enraged',
    cmdDesc:'Whenever Borborygmos deals combat damage, you may discard any number of lands and deal 3 damage to a target for each. The card literally trades patient resource accumulation for immediate consequence — the lands you\'ve been hoarding for the long game become damage right now. Gruul\'s whole identity in one trigger.',
    str:["Calls the actual question when everyone else is still negotiating which question to call.","Will not pretend the meeting was useful when it wasn't.","Brings energy into a stalled room and the room remembers afterwards what they were doing.","Knows when the answer is 'just do it' and is correct more often than is comfortable.","The kind of teammate who is on time, on the work, on the next thing — and gone the moment it's done."],
    weak:["Has been heard saying 'this is just process for the sake of process' about laws or processes that matter.","Will burn down the agenda when given enough latitude.","Treats nuance as someone else's job, which is fine until they're the only one in the room.","Can be promoted into roles where 'just do it' is the wrong instinct. It has not always taken.","Confuses 'I dealt with that quickly' with 'I dealt with that well'."],
    roles:'Operations, Sales, Construction, Military, Crisis Response, Frontline Trades'
  },
  'RAKDOS':{
    name:'RAKDOS',
    tag:'Freedom Through Chaos',
    colors:['B','R'],
    philosophy:"You believe rules are mostly for people too afraid to live. Want it, take it. Feel like it, do it. Regret is what people invented to explain why they didn't. You're not exempt from consequences — you've just decided they're worth it.",
    desc:"You combine self-interest with impulse and arrive at: do what you want, openly, without apology. The room finds you exhausting. The room also finds you reliable in a way no committee can be — what you said is what you'll do.",
    pubBanter:"You treat every meeting like a comedy set. The room loves it. The people picking up the dropped balls afterwards do not love it. You haven't always been able to tell which group you're talking to. You're getting better, slowly, with help.",
    cmd:'Rakdos, Lord of Riots',
    cmdDesc:'Costs 2 less to cast for each life an opponent has lost this turn. *Can\'t be cast unless an opponent has lost life.* The cost reduction IS the engine — the card mechanically requires that the party has already started before the leader shows up.',
    str:["Will say the thing in the meeting that everyone was thinking but nobody planned to say.","Catches the meeting that has lost its purpose and either blows it up or helps it find a new, usually more interesting one.","Reliable in a crisis precisely because crises are when their instincts and the situation finally line up.","Treats company-line phrases the way a magician treats their volunteer — politely, briefly, suspiciously.","Doesn't pretend to be someone they aren't. Saves everyone time."],
    weak:["Treats boredom as a moral category. A quiet period of stable success becomes, itself, a problem.","Has been described as 'lots of fun' and 'somehow the reason we lost two team members' in the same review.","Will undermine an institution they actually need, on principle, then be surprised it's gone.","Comedy timing is good. The judgment about which moments deserve it is patchier.","Confuses sincerity in others with stuffiness. Has been wrong about this. Will probably be wrong about it again."],
    roles:'Disruptive Startups, Aggressive Sales, Entertainment, Activism, Creative Direction'
  },
  'GOLGARI':{
    name:'GOLGARI',
    tag:'Growth Through Decay',
    colors:['B','G'],
    philosophy:"You believe nothing is wasted. What dies feeds what comes next. Failure teaches; success teaches differently. The cycle continues whether you act or don't — your job is to work with it, not pretend you're outside of it.",
    desc:"You combine clear-eyed self-interest with the long patience of things that grow. You don't kill the project to save it; you let it die, and harvest what's still useful. The team finds this slightly unsettling. They come to you when things have died or to understand the long game.",
    pubBanter:"Everything is a metaphor about cycles of life or the natural order of things or rising from the ashes. Sometimes things need to work NOW!",
    cmd:'Meren of Clan Nel Toth',
    cmdDesc:'Whenever another creature you control dies, get an experience counter. At end step, return a creature from your graveyard with mana value ≤ experience. The card literally turns each death into a growing recursion engine — every loss becomes a future return. Golgari\'s compost philosophy made into an end-step ritual.',
    str:['Can sense when initiatives or projects are dead or dying, even when they don\'t know it yet.','Will keep failing initiatives on life support exactly long enough to harvest the useful bits.','Has seen this crisis before — in 2014, in 2017, and again in 2021. Already knows roughly when it ends.','Refuses to throw out the old code, the obsolete framework, or the colleague\'s grudge from 2019. Will need one of them eventually.','Treats failure as compost. Treats success as compost as well, given enough time.'],
    weak:['Will happily let a project die because dying is, in some sense, the point.','Spent eighteen months telling everyone the strategy was rotting from the inside. Was right. But didn\'t try to fix it.','Has a folder labelled \'might be useful in three years\' that contains everything from the last five years.','Mistakes \'something new will arise from this eventually\' for \'I have therefore handled the problem\'.','Doesn\'t ever seem to create anything new.'],
    roles:'Sustainability, Turnaround/Restructuring, Operations, Insolvency Practice'
  },
  'SIMIC':{
    name:'SIMIC',
    tag:'Evolution Through Design',
    colors:['G','U'],
    philosophy:"You believe evolution doesn't stop and shouldn't be expected to. Everything can be improved — usually with care, occasionally with surgery. Nature provides the template. Intelligence accelerates the process when applied carefully.",
    desc:"You combine organic growth with deliberate optimisation. You don't replace the thing — you adjust it, measure, adjust again. Two years later, the thing has fundamentally changed and nobody remembers the original.",
    pubBanter:"You optimise everything to death. Can we ship at 80% and call it done? In six months you'll have shipped at 95%, but no-one will have a job any more because the product was meant to ship six months ago!",
    cmd:'Prime Speaker Vannifar',
    cmdDesc:'Tap and sacrifice a creature: search for a creature with mana value exactly 1 more, put it onto the battlefield. The card mechanically requires sacrificing the current creature to upgrade to a slightly bigger one. Each step incremental; the chain transformative. Simic\'s iterative-improvement thesis.',
    str:["Builds the version they actually wanted, two iterations after the version everyone settled for.","Notices the small system change that make incremental difference and knows how to implement them.","Understands how processes and systems work, and evolve over time. Tends to them like a deliberate gardener.","Will rework the inherited process slightly better every quarter, until two years later it's much better and entirely different.","Has a clear personal standard of 'finished' that's higher than almost anyone else."],
    weak:["Struggles to ship something they consider unfinished, even when 'unfinished' means 'one paragraph short on the docs'.","Improves things that were not the bottleneck. Has been told this. Is improving the way they explain why it was the right thing to do.","Holds the team to the bar in their head, which is mostly higher than the bar in anyone else's head. This can be a bit annoying.","Suspicious of 'good enough' as a moral position, even when good enough is the correct call.","Has, at least once, made a process so robust that nobody outside it understood it."],
    roles:'Product Management, Process Improvement, Biotech, UX Research, Platform Engineering'
  },
  'BOROS':{
    name:'BOROS',
    tag:'Justice Through Action',
    colors:['R','W'],
    philosophy:"You believe some things are worth fighting for, and most things turn out, on inspection, to be one of those things. Justice requires action — principle without effort is decoration. When something matters to you, you commit fully, and you'd rather be exhausted at the end than indifferent at the start.",
    desc:"You combine moral conviction with immediate action. The team you build goes through walls together. (The walls were occasionally not strictly necessary to go through). People believe in things harder around you. It's genuinely useful, and very tiring.",
    pubBanter:"You treat quarterly planning like D-Day. Months on the intensity is exhausting. Can you just relax for one minute and stop talking about the greater good?",
    cmd:'Aurelia, the Warleader',
    cmdDesc:'Whenever Aurelia attacks for the first time each turn, untap her and your other attacking creatures and gain an additional combat phase. Two combats become three. The card literally doubles down on commitment — once you\'ve committed to attacking, you commit again. Boros\'s whole "all-in, then all-in again" thesis.',
    str:['Will run at the actual problem while everyone else is still considering whether having a meeting about the problem might be a good idea.','Builds a team that goes through walls together.','Names things that are unfair or wrong where others might shy away.','Commits to the work as if losing it would mean something.','Genuinely good in a real crisis and someone that people trust to solve things well.'],
    weak:['Has a hammer. Struggles to not use it if something feels wrong or unfair.','Treats \'we could just send an email\' as a form of moral cowardice.','Can\'t quite tell the difference between a difficult conversation and a battle, and tends to err in favour of the second.','Social justice has been impinged? WHERE!!!!!!','Has a list of people who are with us and a list of people who are not with us or are a wrong\'un.'],
    roles:'Military, Crisis Management, Mission Nonprofits, Sales Leadership'
  },
  'BANT':{
    name:'BANT',
    tag:'Harmony Through Structure',
    colors:['W','U','G'],
    philosophy:"You believe civilisation, knowledge, and patience all matter, and that most people pick one and pretend the other two are nice-to-haves. They're not. You want the decision that's fair AND analytically sound AND will still look right in five years. The trade-off is time. You've decided the time is worth it.",
    desc:"You run the meetings where every voice is heard, the data is on the table, and the decision is one we can all live with five years out. The thing takes time and is almost always worth it.",
    pubBanter:"Can we just pick something? You need three rounds of consultation, four spreadsheets, and a stakeholder map to decide where to go for lunch. Yeah, the lunch will be good but it's already 3pm!",
    cmd:'Rafiq of the Many',
    cmdDesc:'Whenever Rafiq attacks alone, exalted (+1/+1) and double strike. The card rewards focused, single-target commitment — the patient attacker who lands twice with one well-considered swing instead of five rushed ones. Bant\'s whole "do the one thing carefully" thesis in a single mechanic.',
    str:['Holds analysis, fairness, and timing in one mental model and rarely drops any of them.','Builds approaches and strategies that a team will actually own, because everyone helped build it.','Has the best chance of building stable, strategic and fair things that actually last.','Plays the four-year game while everyone else is playing the four-week one.','Can create a psychologically safe space where people feel supported.'],
    weak:['Can prioritise team cohesion, accuracy and stability over actual results and outcomes.','Believes a well-run process can prevent conflict. Sometimes but not always true.','Can struggle in a crisis, or when things are needed fast and no good option exists.','Can mistake "the data supports it and we agreed" with "this is going to work"','Can struggle to have difficult conversations.'],
    roles:'Executive Leadership in slow-growth sectors, Strategic HR, Educational Leadership, Policy Development'
  },
  'ESPER':{
    name:'ESPER',
    tag:'Perfection Through Control',
    colors:['W','U','B'],
    philosophy:"You believe optimal outcomes need fair systems, deep analysis, and the willingness to make the actual call. Most people drop one of the three. The system you design serves the organisation; it also serves the people who maintain it; you don't see why those things should be in conflict. They mostly aren't, when designed properly.",
    desc:"You design the system, run the analysis, make the call. You're rarely the warmest person in the room. You're often the one whose decisions are still holding up after six months of pressure. People can forget you being ruthless if things work.",
    pubBanter:"Do you feel anything? Every conversation with you is like talking to a spreadsheet. The unsettling thing is the spreadsheet keeps making the right calls. We don't know how we feel about that.",
    cmd:'Sharuum the Hegemon',
    cmdDesc:'When Sharuum enters, return a target artifact card from your graveyard to the battlefield. The card literally rebuilds broken pieces — the systematic operator who picks up what was lost and gets the machine running again. Esper\'s competence-under-pressure thesis in one ability.',
    str:['Can hold the org chart, the budget, and the actual workflow in one mental model.','Made the move that mattered four quarters ago. Nobody noticed at the time. Sometimes they never notice.','Builds systems which make it easy for the right answer to end up being the path of least resistance.','Understands why bureaucracy is needed and how to use it to best help their team, field or mission.','Is able to understand and name trade-offs and make the right decision dispassionately.'],
    weak:['Has solved for the optimum and can be mildly puzzled when people impacted by that optimsation seem upset.','There is an implicit tension in trying to create equitable frameworks with wanting those to help THEM.  Altruism only goes so far.','Can struggle to take action in unclear, information-poor situations such as a crisis.','SOft power can be powerful, but every so often a bit of high energy approach achieves things faster.','Can refers to colleagues by their function and value not their name. Colleagues notice that.'],
    roles:'CFO/Finance, Chief Compliance Officer, Strategic Operations, Management Consulting'
  },
  'GRIXIS':{
    name:'GRIXIS',
    tag:'Power Through Ruthless Action',
    colors:['U','B','R'],
    philosophy:"You believe intelligence, ambition, and aggression compound. Analyse the situation, take the position, strike. The people who can't combine the three lose to the people who can. You'd rather achieve the outcomes that matter to you and be disliked than lose and be admired.",
    desc:"You read the situation faster than most, decide harder than most, and move on the decision before anyone has had time to object. The room finds you exhausting. The room also finds you reliable when something needs to actually happen now.",
    pubBanter:"There is never a calm day with you around. If a meeting isn't adding value the pin on the grenade gets pulled. We're not mad. We're tired. We're going home.",
    cmd:'Nekusar, the Mindrazer',
    cmdDesc:'Whenever a player draws a card, Nekusar deals 1 damage to them. Force the table to draw with your spells; every card they need wounds them. The card mechanically weaponises the thing they need to play the game. Pure Grixis — turn the resource into the weapon.',
    str:['Calls the move before everyone else has finished diagramming the board. Is, infuriatingly, usually right about which move it is.','Reads which way something will move three weeks before it folds, and is already positioned ready to go.','Almost always able to adjust faster than the situation through prediction and action.','Is happy to name the cost out loud and to pay it.','Builds ruthlessly effective teams that deliver, fight, and play hard with each other in the same channel.'],
    weak:['Has used "it\'s just business" to describe something that was, by any honest reading, slightly personal.','Earns trust in ten meetings. Spends it in one. Doesn\'t always earn enough to spend.','Can risk burning people or burning them out. Doesn\'t always care.','The optimisation works. The optimisation can also produce a host of ongoing issues.','Believes pressure improves people, and is sincerely puzzled when colleagues leave for somewhere with less of it.'],
    roles:'Turnaround CEO, Competitive Strategy, High-Stakes Trading, Private Equity'
  },
  'JUND':{
    name:'JUND',
    tag:'Survival Through Hunger',
    colors:['B','R','G'],
    philosophy:"You believe survival rewards the hungry and the adapted. You trust your instincts because they've kept you here. You let the things that aren't working exit or die or you kill them — that's not cruelty, that's how systems renew. People who can't do this are running on borrowed time and don't know it yet.",
    desc:"You combine appetite, instinct, and patience. You hunt. The team finds this slightly alarming most of the time, but very useful on the day that competition shows up.",
    pubBanter:"Every meeting becomes a forum to push. Every project is a fight you intend to win. We want you in the foxhole. We do not want you on the calendar for a chat about feelings. Ever.",
    cmd:'Prossh, Skyraider of Kher',
    cmdDesc:'When Prossh enters, create X 0/1 Kobolds where X is the mana spent. Sacrifice any number of creatures: Prossh gets +1/+0 until end of turn. The card literally turns your own resources into a leader who grows by eating them. Jund\'s "feed yourself or die" thesis on one card.',
    str:['Will go for the throat of the project nobody else wanted to fight. Often returns with the throat.','Treats "this is hard" as a description, not an obstacle. Notes the description. Continues.','Will set a target nobody believes in, then hit it, partly out of spite.','Names who\'s actually in charge and what they actually want. Most rooms had been agreeing not to mention these things.','Has started, or been through three layoffs and is still here.'],
    weak:['Treats the long-term cost of how they got here as a problem for whoever inherits the problem.','Built a pace nobody else can hold and is mildly puzzled when the team doesn\'t share it.','Has explained, with a straight face, that the people who left "weren\'t built for this".','Believes nuance is what people do when they don\'t have a clear answer.','Is high-performing, but people area slightly afraid of them.'],
    roles:'Aggressive Sales, Competitive Industries, Startups, Sports, Private Equity'
  },
  'NAYA':{
    name:'NAYA',
    tag:'Power Through Community',
    colors:['R','G','W'],
    philosophy:"You believe strength comes from a community aligned with natural purpose. Fight for your people, trust your instincts, grow together. The fancy abstract approaches are downstream of having a team that actually shows up. You've built that team. You don't apologise for the volume of work because it all matters.",
    desc:"You walk in and the temperature goes up two degrees. People believe in things harder around you. The team you build will run through walls together, sing while doing it, and apologise to the walls afterwards.",
    pubBanter:"Why does every task need pep talks and a marching band? We just needed to update a spreadsheet. The spreadsheet got updated by Wednesday. We were also at the parade. We don't fully understand how this works. But gosh it's fun!",
    cmd:'Samut, Voice of Dissent',
    cmdDesc:'Your creatures have haste. Tap: untap another creature. The card grants the team itself permanent urgency — everyone moves as fast as Samut does, and she pulls the slow ones into the action. Naya\'s "everybody moves together, everybody moves now" in two abilities.',
    str:['Walks into a stalled room and the room remembers what it was doing.','Builds a team that, three weeks in, would run through walls for each other. The walls are still standing because they\'re ALSO just so pumped to be here!','Knows everyone. Has had drinks with everyone. Has been forwarded the petition by everyone, and is partly why the petition succeeded.','Will start the thing nobody else thought was worth starting, and it will be worth starting by week two.','Means it. The earnestness is real. Other people\'s irony bounces off it.'],
    weak:['Treats the third hour of the Tuesday call with the same energy as the first ten minutes. The team does not.','The big speech was on Wednesday. The follow-up big speech is on Thursday. The follow-up to the follow-up speech is later on Thursday.','Believes the more interesting and fairer idea wins, which is almost always untrue. Suprised when it proves not to be.','Has so much enthusiasm for the work that quieter colleagues can\'t get a word in to say where it should actually point.','Is three suburbs away from the detail and the version control and the nuance.  That bites. Regularly.'],
    roles:'Startups, Marketing, Politics, Sales, Event Planning, Community Building'
  },
  'ABZAN':{
    name:'ABZAN',
    tag:'Endurance Through Tradition',
    colors:['W','B','G'],
    philosophy:"You believe lasting power comes from patience, pragmatism, and community held together over decades. Invest in what endures. Cut what doesn't. The flash-in-the-pan strategies look impressive for a quarter. You're playing the next decade.",
    desc:"You build things that are still standing in 2034 because they were built by someone who remembers 2014. You know who can be counted on, who can't, and which of the second group can be counted on in specific weather. You act on that.",
    pubBanter:"You block every new idea with \"we've always done it this way.\" You also keep a ledger of who owes who going back decades.",
    cmd:'Karador, Ghost Chieftain',
    cmdDesc:'Costs {1} less for each creature card in your graveyard. May cast a creature from graveyard each turn. The card mechanically turns the past into a resource — Karador gets cheaper, and more capable, the more history you have. Abzan\'s "heritage IS the asset" thesis, literally.',
    str:['Builds things designed to still be standing in 2034, and largely succeeds, because they were designed by someone who remembers 2014.','Has outlasted four CEOs, three reorgs, and one merger. The org chart updates. Their corner office does not.','Will choose "still working in five years" over "mildly impressive in the next quarter" every time. Has been right often enough.','Knows who can be counted on, who can\'t, and which of the second group can be counted on in specific weather.','Has carried the organisation through the kind of year that historically dissolves organisations.'],
    weak:['Has explained, with great patience, why the new system won\'t work. Has been right twice and wrong four times.','The promotion goes to the loyal, then the long-standing, then the deserving, then anyone left over.','The pilot programme has been in pilot since 2019.  Good things take time.','Karen made a comment in the 2017 offsite. Karen has been quietly underweighted in every staffing decision since.','Has built a system in which everyone owes someone else a favour. The system is stable. The system is immovable. The system is sometimes the point.'],
    roles:'Family Businesses, Legal, Traditional Industries, Politics'
  },
  'JESKAI':{
    name:'JESKAI',
    tag:'Excellence Through Discipline',
    colors:['U','R','W'],
    philosophy:"You believe excellence comes from disciplined practice applied with passion and held within principles. The work is the thing. The hours are the cost and the cost is fair. Most people who think they're excellent haven't actually put in the hours. You have. You don't bring it up. Mostly.",
    desc:"You've put in the hours on three different things and are, technically, world-class at all of them. You don't lead with it. The work tends to speak. When asked, you'll explain the method. The method usually takes longer than the asker has time for.",
    pubBanter:"Everything we do is basic, apparently. You roll your eyes at our approach constantly. You're irritatingly right about our approach most of the time, which is the bit we can't quite forgive.",
    cmd:'Narset, Enlightened Master',
    cmdDesc:'When Narset attacks, exile the top four cards. You may play non-creature cards exiled this way. The mastery delivers the right tool at the right moment — nothing in your hand, but everything you\'ve trained for shows up when you swing. Jeskai\'s discipline-becomes-instinct thesis.',
    str:['Has put in the hours on three different things and is technically world-class at all of them. Doesn\'t particularly care if people know or not.','Reads the spec, the footnote, and the email about why the footnote was added. Catches the moral quandary in the position that noone else saw and fixes it.','Plays the move three turns ahead, then explains why the previous turn was the actual point of leverage.','Demonstrates the standard by doing it. Doesn\'t explain the standard. The standard is the explanation.','Able to switch from the prepared plan to the live read mid-action, without showing the gear-change, pivoting around purpose.'],
    weak:['Cannot quite hide that they think the room is, on average, beneath them. The room can tell.','Forgets the basics are basic because someone learned them. Has ruined the kickoff by leading with the advanced version. Three times.','Treats people who haven\'t put in their hours as a regrettable but tolerable feature of the workplace.','Will redo the work that was already correct because it could have been more correct.','Can mentor brilliantly. Will not, however, mentor anyone whose questions are too obvious.'],
    roles:'Consulting, Teaching, Professional Services, Strategy'
  },
  'SULTAI':{
    name:'SULTAI',
    tag:'Growth Through Exploitation',
    colors:['B','G','U'],
    philosophy:"You believe patient analysis and strategic positioning beat aggressive haste. Understand the cycles. Position yourself within them. Extract value over time, sustainably, before anyone notices you've been doing it. Most people who think they're playing the long game are actually playing the medium one.",
    desc:"You combine patience, intelligence, and a long view of who's holding what. You cultivate. Other people grow. The garden gets tidier.",
    pubBanter:"You're slimy. You co-opt everyone's work and somehow it becomes part of your little empire. The empire is also the reason our team gets resourced and we resent it.",
    cmd:'Sidisi, Brood Tyrant',
    cmdDesc:'When Sidisi enters and at upkeep, mill 3. Whenever a creature card hits your graveyard, create a 2/2 zombie. The card literally turns information loss into army. Sultai\'s "whatever you discard, I\'ll use" thesis on one trigger.',
    str:['Plays the eight-quarter game. The first six quarters look like nothing is happening. The seventh is when everyone else notices.','Was already in the right meeting before anyone knew which meeting was going to be the right one.','Knows what every person at the table has to give, what they think they\'re giving, and the spread between those numbers.','Has regularly been described as "helpful" by people who haven\'t quite yet noticed what they\'re being helped towards.','Has been planning this since the previous restructure. Has been planning the next restructure since this one.'],
    weak:['The other person\'s idea got better with their input. The other person\'s idea is now somehow on their slide.','Does not need to win the conversation but DOES need to be in the room where the conversation is happening or have someone in there.','Has not done anything technically wrong. Has done several things that, taken together, would make an outside observer raise an eyebrow.','Will not move until the move is unloseable, which means missing the move that was winnable.','Is rarely the person someone would name as a close friend. Is, however, rarely the person nobody can or would name.'],
    roles:'Private Equity, VC, Corporate Development, Real Estate'
  },
  'MARDU':{
    name:'MARDU',
    tag:'Victory Through Sacrifice',
    colors:['R','W','B'],
    philosophy:"You believe decisive action within a clear hierarchy wins. Lead from the front. Reward loyalty. Move fast. Things will break. People will burn out. You take that seriously when it happens, and you also keep moving — because the cost of losing the thing was higher than the cost of paying for the win.",
    desc:"You combine passion, order, and ruthlessness. The team moves at your pace. Some of the team keep up. When something goes wrong, you take it seriously. You also keep moving. If someone gets left behind, so be it.",
    pubBanter:"Every deadline is life or death. You glorify burnout as commitment. You'll flip tables to make us move faster. The table gets flipped. We move. The deadline gets met. Those of us still here are exhausted.",
    cmd:'Alesha, Who Smiles at Death',
    cmdDesc:'Whenever Alesha attacks, pay {W}{B}: return a creature card with power 2 or less from graveyard, tapped and attacking. The card mechanically brings back the overlooked and underestimated, then leads them straight into the fight. Mardu\'s "glory through any means" thesis — she literally smiles at sacrifice.',
    str:['Calls the call. Owns the call. Doesn\'t relitigate it after the fact.','The bigger the stakes, the calmer the voice.','Knows who needs to be told what, in which order, and by whom. The plan reaches the room before the plan does.','Delivers the result. The cost is a separate conversation that, conveniently, someone else has to lead.','Holds the line when the line is dissolving. The team remembers this. Mostly fondly.'],
    weak:['Treats months of hard work as a warm-up.','Has a quiet pride about the people on the team who "gave everything," and a quiet absence of curiosity about where they are now.','The win was real. The costs of getting it were also real. They are not on the same slide.','Sometimes has a peace-time. It is between Christmas and the second of January, inclusive.','Looks around after a successful quarter and is briefly surprised by how few of the original team are still in the room.'],
    roles:'Turnarounds, Crisis Management, Sales, Founding Teams, Competitive Markets'
  },
  'TEMUR':{
    name:'TEMUR',
    tag:'Power Through Adaptation',
    colors:['G','U','R'],
    philosophy:"You believe wild creativity and raw power combine best when guided by understanding. Experiment boldly, trust the instinct that's working today, learn from what nature already figured out. The right approach for this problem is probably not the approach for the last problem, and that's fine. You've made peace with that.",
    desc:"You combine strength, intelligence, and passion. The strategy adapts. The strategy adapts again. The strategy adapts a third time. Something gets done. Nobody who didn't pivot is further along than you are.",
    pubBanter:"The pivot whiplash is real. We're constantly adapting to whatever idea pounced out of you this week. Two of the three pivots will turn out to have been right. We've stopped trying to predict you. We've also stopped trying to plan around you.",
    cmd:'Surrak Dragonclaw',
    cmdDesc:"Can't be countered. Your creatures can't be countered. Your other creatures have trample. The card mechanically protects your impulses from interruption — once you've committed to the play, nothing stops it landing. Temur's \"this is happening, deal with it\" thesis.",
    str:['Will sketch the new approach in the meeting, build the prototype that night, and have it half-broken in production by Thursday.','Comes up with the angles that nobody else thought of.','Walks in with a new idea every morning. Some mornings the new idea is the right one.','Is calmest when the situation isn\'t.','Will try the thing nobody got permission to try. Sometimes returns with permission, retroactively.'],
    weak:['Has been on the same project for six weeks and rewritten the foundations three times.','The Monday plan is not the Wednesday plan. Wednesday\'s plan will not survive Wednesday.','Believes plans are a starting point, which is true, but believes ALL plans at all stages are a starting point.','The team has, collectively, stopped scheduling anything more than two weeks out.','Brilliant in chaos. Mildly destructive in stability.'],
    roles:'Startups, Innovation, R&D, Creative Industries'
  },
  'WITCH':{
    name:'FOUR-COLOR (No Red)',
    tag:'Perfection Without Passion',
    colors:['W','U','B','G'],
    philosophy:"You believe sustainable success comes from patience, analysis, and quiet positioning. You don't see what passion adds — most of the time it just makes things louder. You'd rather get the right answer eventually than the dramatic answer immediately. People who confuse intensity with effectiveness lose to people who don't.",
    desc:"You're the person whose plans are still working in three years. You don't generate urgency; you absorb it, analyse it, and decide whether it actually requires action. The team finds you calm in a way that's either reassuring or unnerving, depending on the week.",
    pubBanter:"Do you actually have feelings? Every conversation with you is like talking to a spreadsheet. Nothing seems to move you. The spreadsheet keeps being right though, which is the part we can't argue with.",
    cmd:"Atraxa, Praetors' Voice",
    cmdDesc:'Proliferate at end step — add a counter of any kind already on a permanent or player. The card mechanically rewards slow, patient accumulation across multiple dimensions at once. No combat tricks, no rushes — just steady, methodical growth in whatever direction you\'ve chosen. Witch\'s "compound over time" thesis in one trigger.',
    str:['Holds analysis, fairness, ambition, and patience in one mental model without any of them outweighing the others.','Builds the strategy that compounds over years, not the strategy that wins today\'s meeting.','Wins the long argument by being in the room every time. The other people stopped coming three meetings ago.','Reads situations without the emotional component clouding the analysis. Rarer than it sounds.','Made the move that was right four quarters ago without needing the credit. Quietly correct.'],
    weak:['Lacks the internal urgency that says "this needs to happen NOW." Important windows close while the analysis matures.','Can come across as emotionally absent. Colleagues sometimes wonder if you actually care about the work.','Dismisses passionate ideas as "inefficient" without considering whether the passion was load-bearing.','Treats joy and energy as variables that don\'t usefully feature in any equation worth running.','Has, occasionally, watched a crisis happen and analysed it correctly while taking no action.'],
    roles:'Operations, Finance, Strategy, Long-term Planning, Sovereign Wealth, Patient Capital'
  },
  'YORE':{
    name:'FOUR-COLOR (No Green)',
    tag:'Innovation Without Nature',
    colors:['W','U','B','R'],
    philosophy:"You believe progress comes from transcending what's already there. Tradition is data, not destination. The right approach for the new problem is rarely the right approach for the last problem — and the smart, ambitious, hard-working team you've built around you will help you find it.",
    desc:"You combine analytical rigor, ambition, and urgency — without the patience to leave things alone just because they've been working. You build complex systems, you rebuild them when they don't quite fit, and you rebuild them again. The team is exhausted. The thing eventually works.",
    pubBanter:"You over-engineer everything. Simple solution? Never. Needs seventeen moving parts that'll need emergency fixes in two weeks. Yes the seventeen parts will keep working for four years. We're not in that future. We're in this Wednesday and everything is on fire.",
    cmd:'Breya, Etherium Shaper',
    cmdDesc:'When Breya enters, create two 1/1 thopter tokens. Then sacrifice an artifact for various effects: drain 1, +2/-2, or 3 damage to target. The card literally exists to assemble parts, then disassemble them for value. Yore\'s "build things, take them apart, build the next version" thesis in one card.',
    str:['Will actually deliver the thing that didn\'t exist yesterday. Treats this as the baseline.','Holds the thirteen-part architecture in their head. Updates it mid-flight. The architecture survives.','Has thought three steps past where everyone else stopped. Is mildly impatient that the others haven\'t caught up.','Cares. Visibly cares. Will work past 11pm because the work isn\'t right yet, and someone, somewhere, should care that it isn\'t.','Doesn\'t trust the manual process to stay correct, and quietly builds the automation that catches the human error before the human notices.'],
    weak:['The grocery list is now a system. The system has roles. The roles have onboarding.','If the solution is short, the problem must have been wrong. Has been wrong about this approximately half the time.','Has built a personal velocity that\'s incompatible with most human bodies, including their own.','The four-week project has been rebuilt three times because the first version wasn\'t quite right. The first version was correct.','Can\'t leave things alone. The team\'s energy goes into keeping up with the changes, not into the work the changes were supposed to enable.'],
    roles:'Tech Startups, Engineering Leadership, R&D, Disruption, FinTech, Founders'
  },
  'GLINT':{
    name:'FOUR-COLOR (No White)',
    tag:'Power Without Morality',
    colors:['U','B','R','G'],
    philosophy:"You believe effectiveness matters more than the rules of the room. Understand the system, exploit the opportunity, act decisively, adapt when the environment changes. Most \"ethics\" you encounter are someone's protection of a position, dressed up as principle. You can usually tell which is which, and you act accordingly.",
    desc:"You combine intelligence, ambition, urgency, and adaptability — without the group-level loyalty that would keep you inside the lines. You see how things work, you see what you can do with that, and you do it. The team finds you brilliant and untrustworthy in roughly equal measure.",
    pubBanter:"Rules are for suckers, apparently. You hijack projects for fun and leave smoking wreckage everywhere. We never know what you're going to do next. Sometimes that's exciting. Mostly it's just exhausting.",
    cmd:'Yidris, Maelstrom Wielder',
    cmdDesc:'When Yidris deals combat damage, spells you cast this turn have Cascade. Cascade means when you cast a spell, exile cards until you hit one with lower mana value, then cast that for free. The card literally turns one decision into a chain of free decisions you don\'t have to justify. Glint\'s "I\'m operating outside the normal cost structure" thesis in one trigger.',
    str:['Will try the move that\'s technically against the rules on the chance that "technically against the rules" was the only thing keeping it from working.','Closes the deal that needed closing. Doesn\'t ask whether the next person needed to be on the call.','Treats new constraints as features of the terrain rather than moral statements, and routes around them.','Knows which rules can be broken, by whom, and at what cost. Has done the math. The math says: more than you\'d think.','Has no sacred cows. Will burn down the architecture two people built their reputation on if it stops working.'],
    weak:['Treats "is this okay?" as a question for someone else\'s department, which it largely is — until it isn\'t.','Will make commitments in good faith and exit them, in good faith, when the situation has updated.','The project they touched is now thirty percent better and forty percent on fire. The percentages do not net out.','Has, by the third quarter, become someone the rest of the team works around rather than with. Has not noticed. Is winning.','When the consequences arrive, will be in a different role at a different company, mildly surprised to be asked.'],
    roles:'Disruption, High-Risk Ventures, Competitive Industries, Distressed Asset Acquisition, Activist Investing'
  },
  'DUNE':{
    name:'FOUR-COLOR (No Blue)',
    tag:'Action Without Analysis',
    colors:['W','B','R','G'],
    philosophy:"You believe action reveals truth faster than analysis. Trust your gut. Commit fully. Adapt as you go. Overthinking is what people do when they're afraid to be wrong — and you'd rather be wrong fast and recover than be right too late to matter.",
    desc:"You combine community, ambition, urgency, and patience — without the analytical step that would slow any of it down. You commit on instinct, lead from the front, and figure it out in motion. The team that follows you is loyal and slightly bruised.",
    pubBanter:"You charge in on instinct every time. Planning? Never. Already yelling NO TIME NEXT while we're picking up pieces from the last impulse decision. Then it's Tuesday and the thing is done. We never figured out how. We've stopped asking.",
    cmd:'Saskia the Unyielding',
    cmdDesc:'As Saskia enters, choose a player. Damage your creatures deal to a player is also dealt to the chosen player. The card mechanically turns every attack into double the damage on the table — no analysis needed, just attack and let the consequence happen everywhere at once. Dune\'s "commit, then commit harder, then see what happens" thesis.',
    str:['Cuts through the meeting that was about to go around the table for a third time. The decision is made. The decision is largely correct.','Reads the situation in the room and acts on it before the situation gets read out loud.','Walks in with the kind of energy that means something is about to happen. Something usually is.','Builds a team that will go anywhere with them, partly because they\'ve already gone.','Has never failed to ship by overthinking. Has, on occasion, failed to ship correctly, which is a different problem.'],
    weak:['Will dismiss the analysis as "analysis paralysis" before the analysis has finished its first sentence.','Treats the plan as something that happens to other people. The plan, mostly, agrees.','Has shipped the thing on Tuesday and is fixing the thing on Wednesday. This is, technically, an iterative methodology.','If the answer needed a spreadsheet, the question wasn\'t the right question. Has, occasionally, been wrong about this.','The teams that work with them love them. The teams that have to clean up after them are quieter about it.'],
    roles:'Sales, Operations, Crisis Response, Military, Frontline Leadership, Field Operations'
  },
  'INK':{
    name:'FOUR-COLOR (No Black)',
    tag:'Altruism Without Pragmatism',
    colors:['W','U','R','G'],
    philosophy:"You believe genuine progress comes from serving something larger than yourself. Analyse, create, build community, trust what's already working — but never exploit. The thing you're most proud of is the \"never exploit.\" It's also, when you're honest, the part most likely to leave you holding the bill while less idealistic people walk off with the win.",
    desc:"You combine order, knowledge, urgency, and patience — without the self-interested calculation that would protect any of it. You help people. You build things that serve others. The team that gathers around you is loyal and somewhat worried about you.",
    pubBanter:"You're trying to help everyone at once and it's a circus. Confetti explosions in every direction. You also showed up the time when nobody else did, which is why nobody quite has the heart to mention the confetti.",
    cmd:'Kynaios and Tiro of Meletis',
    cmdDesc:'At your end step, each player draws a card and may put a land from hand onto the battlefield. The card literally gives every player resources — your turn enriches the whole table. Ink\'s "the rising tide raises all boats" thesis in one trigger, including the part where the other boats are sometimes faster than yours.',
    str:['Believes the work can be both genuinely useful and genuinely good. Has, occasionally, made it both.','Plans across community, idea, energy, and growth. Forgets to plan around budget.','Walks into the cynical room and the cynicism quietly excuses itself for the rest of the meeting.','Holds the door open for the people the rest of the org has stopped noticing. The people walk through.','Finds the angle that helps everyone, partly by not considering whether anyone should be helped less.'],
    weak:['Cannot quite believe that some of the people in the room are simply optimising for themselves. They are.','Has been used as the cover story for someone else\'s plan, twice, and is currently in conversation about it being a third time.','Three good causes in flight, four more being considered, one in budget overrun, none in clearly-defined scope.','Believes everyone is broadly trying, which is mostly true and almost never universally true.','Will give the win to the room rather than take it. Generous, and also why they keep ending up under-credited.'],
    roles:'Nonprofits, Education, Community Building, Social Enterprise, Cooperative Movement, Mission-Driven Leadership'
  },
  'WUBRG':{
    name:'FIVE-COLOR',
    tag:'Chaos or Mastery',
    colors:['W','U','B','R','G'],
    philosophy:"You believe every approach has its place. Context determines which one. The trick is knowing when to apply which — and having the range to do so. The trick is also, sometimes, picking one and going.",
    desc:"You have access to everything: every strategy, every tool, every philosophy. The result is either a Renaissance person or a generalist who hasn't picked one yet. The line between those two is harder to see from inside.",
    pubBanter:"Kitchen sink into every project. We are taking bets on which spinning plate crashes first. We were also taking bets last quarter. None of them crashed. We have stopped taking bets.",
    cmd:'Kenrith, the Returned King',
    cmdDesc:'Five colors at once — every angle available, no shortage of opinions about which to use',
    str:['Can take the technical role on Monday, the people role on Tuesday, the strategy role on Wednesday, and is mildly puzzled when this isn\'t normal.','Holds five different framings of the problem at once. The right framing surfaces, eventually, though sometimes after the meeting.','Sees the same situation from analysis, ambition, structure, instinct, and patience in the same breath. Mostly correctly.','Speaks five different professional dialects fluently, and switches between them mid-sentence without noticing.','Notices what each other identity would notice. The disadvantage is being asked to do something with all of it.'],
    weak:['Holds five priorities and gives each one twenty percent of the energy. The math nets out. The outcome does not.','Is, by their own honest assessment, the second-best person in the room at every individual thing, which is rarely the same as being useful.','In a Blue room, becomes Blue. In a Red room, becomes Red. The selves are real. There are quite a lot of them.','Cannot quite answer \'what do you actually believe\' without first asking what kind of room they\'re in.','Three years of running everything has produced a CV that, read cold, looks like five different people\'s CVs glued together.'],
    roles:'Consulting, General Tazri, Generalist Leadership, Facilitation, Portfolio Management'
  }
};
