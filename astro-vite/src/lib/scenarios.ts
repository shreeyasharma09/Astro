export interface Scenario {
  id: string;
  title: string;
  short: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: string;
  emoji: string;
  summary: string;
  character: string;
  opener: string;
}

export interface Choice {
  id: string;
  text: string;
}

export type Turn =
  | { role: 'assistant'; text: string }
  | { role: 'system'; text: string }
  | { choices: Choice[] };

export const SCENARIOS: Scenario[] = [
  {
    id: 'coffee', title: 'Ordering Coffee at a Counter', short: 'Ordering coffee', difficulty: 1, category: 'Food & Drink', emoji: '☕',
    summary: 'Stating a clear order, handling a small interruption, thanking the person.',
    character: 'Friendly but slightly busy barista.',
    opener: 'Hi there, welcome in! What can I get started for you today?',
  },
  {
    id: 'directions', title: 'Asking a Stranger for Directions', short: 'Asking for directions', difficulty: 1, category: 'Out & About', emoji: '🧭',
    summary: 'Opening with a polite excuse-me, stating the ask, thanking and exiting.',
    character: 'Passerby, polite, in a mild hurry.',
    opener: "Oh — hi, yeah, what's up?",
  },
  {
    id: 'menu', title: 'Asking a Server About the Menu', short: 'Menu questions', difficulty: 2, category: 'Food & Drink', emoji: '🍽️',
    summary: 'Asking about ingredients or swaps without over-apologizing.',
    character: 'Attentive server.',
    opener: 'Hi! Are you ready to order, or do you have questions about the menu?',
  },
  {
    id: 'phone-appt', title: 'Calling to Book an Appointment', short: 'Phone call: appointment', difficulty: 2, category: 'Phone Calls', emoji: '📞',
    summary: 'Stating your reason, giving info, handling being put on hold.',
    character: 'Clinic receptionist.',
    opener: "Good morning, Dr. Patel's office, this is Marie. How can I help you?",
  },
  {
    id: 'return', title: 'Returning an Item to a Store', short: 'Returning an item', difficulty: 3, category: 'Out & About', emoji: '🛍️',
    summary: 'Explaining the return calmly, handling a "let me check with my manager".',
    character: 'Customer service associate, neutral.',
    opener: 'Hi, were you looking to return something?',
  },
  {
    id: 'professor', title: 'Asking a Professor After Class', short: 'Question for a professor', difficulty: 3, category: 'School & Work', emoji: '🎓',
    summary: "Framing a specific question, admitting what you don't understand.",
    character: 'Professor, friendly, finishing up notes.',
    opener: "Hey — did you have a question? I've got a minute before my next thing.",
  },
  {
    id: 'smalltalk', title: 'Small Talk with a Classmate', short: 'Small talk', difficulty: 3, category: 'School & Work', emoji: '💬',
    summary: 'Returning a question, picking up a conversational thread, ending warmly.',
    character: 'Classmate, approachable.',
    opener: "Oh hey — how's your week going?",
  },
  {
    id: 'party', title: 'Joining a Group Conversation at a Party', short: 'Joining a group', difficulty: 4, category: 'Social Events', emoji: '🎉',
    summary: 'Waiting for a pause, a brief intro, a light on-topic comment.',
    character: 'Two friends mid-conversation.',
    opener: "[They're talking about a show they both watched. You approach.]",
  },
  {
    id: 'meeting', title: 'Speaking Up in a Group Meeting', short: 'Speaking up in a group', difficulty: 4, category: 'School & Work', emoji: '👥',
    summary: 'Verbal entry, stating a view briefly, holding it under gentle pushback.',
    character: 'Group members discussing plans.',
    opener: '[The group has just suggested splitting the project a certain way.]',
  },
  {
    id: 'decline', title: 'Declining an Invitation Kindly', short: 'Saying no to plans', difficulty: 5, category: 'Social Events', emoji: '🫶',
    summary: 'Saying no once clearly, keeping warmth, resisting over-apology.',
    character: 'Close friend, a bit persistent.',
    opener: "Heyyy — a bunch of us are going out Friday. You're in, right?",
  },
];

export const DEMO_TURNS: Record<string, Turn[]> = {
  coffee: [
    { role: 'assistant', text: 'Hi there, welcome in! What can I get started for you today?' },
    { choices: [
      { id: 'a', text: 'Hi! Could I get a medium oat milk latte please?' },
      { id: 'b', text: "Um, sorry, I'm not ready yet." },
      { id: 'c', text: 'Hi, what do you recommend?' },
    ] },
    { role: 'assistant', text: 'A medium oat latte, coming right up. Anything else with that?' },
    { choices: [
      { id: 'a', text: "No thanks, that's it." },
      { id: 'b', text: 'Actually, could I add a small blueberry muffin?' },
    ] },
    { role: 'assistant', text: "Perfect — that'll be $6.75. Can I get a name for the order?" },
    { choices: [
      { id: 'a', text: "Sure, it's Alex." },
      { id: 'b', text: 'Oh, uh — Alex. Sorry!' },
    ] },
    { role: 'assistant', text: "Thanks Alex! I'll call you when it's ready." },
    { role: 'system', text: "Nice work. That's a full interaction — you handled it well." },
  ],
};

// Canned suggestion chips for Type mode. Phase 2 swaps these for LLM-generated.
export const TYPE_SUGGESTIONS: Record<string, string[]> = {
  coffee: ['a muffin', 'a pastry', 'thanks', 'for here'],
  directions: ['the library', 'a cafe nearby', 'thanks so much'],
  menu: ['allergens?', 'gluten-free?', 'no thanks'],
  'phone-appt': ['earliest available', 'thanks', 'afternoons work'],
  return: ["it didn't fit", 'thanks', 'store credit is fine'],
  professor: ['office hours?', 'the slide on', 'thank you'],
  smalltalk: ['good, you?', 'same here', 'have a good one'],
  party: ['totally', 'which season?', 'haha yeah'],
  meeting: ['one thought —', 'could we', 'agreed'],
  decline: ['maybe next time', 'thank you', 'have fun!'],
};

export function getScript(id: string): string {
  const scripts: Record<string, string> = {
    coffee: 'Hi, could I get a medium oat latte please?',
    directions: 'Excuse me — sorry to bother you, do you know how to get to the library?',
    menu: 'Hi! Sorry, quick question — is the pasta dairy-free?',
    'phone-appt': "Hi, I'm calling to book a new patient appointment.",
    return: "Hi, I'd like to return this — it didn't quite work out.",
    professor: "Hey Professor — do you have a minute? I had a quick question about today's lecture.",
    smalltalk: 'Hey! Pretty good. How about you?',
    party: 'Hey, mind if I jump in? I love that show too.',
    meeting: "Can I add something? I'd suggest we split it a bit differently.",
    decline: "That sounds fun! I'm gonna sit this one out — have the best time.",
  };
  return scripts[id] || "Let's give it a try.";
}