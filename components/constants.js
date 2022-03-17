const archetypes = [
    {
        title: 'Hero',
        description: 'The protagonist who rises to meet a challenge and saves the day.',
        strengths:  'courage, perseverance, honor',
        weaknesses: 'overconfidence, hubris',
        examples: 'Achilles (The Iliad), Luke Skywalker (Star Wars), Wonder Woman (Wonder Woman), Harry Potter (Harry Potter and the Sorcerer’s Stone)',
        label: 'MASTERY',
    },
    {
        title: 'Magician',
        description: 'A powerful figure who has harnessed the ways of the universe to achieve key goals.',
        strengths:  'omniscience, omnipotence, discipline',
        weaknesses: 'corruptibility, arrogance',
        examples: 'Prospero (The Tempest), Gandalf (The Lord of the Rings), Morpheus (The Matrix), Darth Vader (Star Wars)',
        label: 'MASTERY',
    },
    {
        title: 'Outlaw',
        description: 'The rebel who won’t abide by society’s demands.',
        strengths:  'independent thinking, virtue, owes no favors',
        weaknesses: 'self-involved, potentially criminal',
        examples: 'Han Solo (Star Wars), Dean Moriarty (On the Road), Humbert Humbert (Lolita), Batman (The Dark Knight)',
        label: 'MASTERY',
    },
    {
        title: 'Explorer',
        description: 'A character naturally driven to push the boundaries of the status quo and explore the unknown.',
        strengths:  'curious, driven, motivated by self-improvement',
        weaknesses: 'restless, unreliable, never satisfied',
        examples: 'Odysseus (The Odyssey), Sal Paradise (On the Road), Huckleberry Finn (The Adventures of Huckleberry Finn), Sherlock Holmes (Sherlock Holmes)',
        label: 'INDEPENDENCE',
    },
    {
        title: 'Sage',
        description: 'A wise figure with knowledge for those who inquire. The mother figure or mentor is often based on this archetype.',
        strengths:  'wisdom, experience, insight',
        weaknesses: 'cautious, hesitant to actually join the action',
        examples: 'Athena (The Odyssey), Obi-Wan Kenobi (Star Wars), Hannibal Lecter (The Silence of the Lambs), The Oracle (The Matrix)',
        label: 'INDEPENDENCE',
    },
    {
        title: 'Innocent',
        description: 'A morally pure character, often a child, whose only intentions are good.',
        strengths:  'morality, kindness, sincerity',
        weaknesses: 'vulnerable, naive, rarely skilled',
        examples: 'Tiny Tim (A Christmas Carol), Lennie Small (Of Mice and Men), Cio-Cio-san (Madame Butterfly), Buddy the Elf (Elf)',
        label: 'INDEPENDENCE',
    },
    {
        title: 'Creator',
        description: 'A motivated visionary who creates art or structures during the narrative.',
        strengths:  'creativity, willpower, conviction',
        weaknesses: 'self-involvement, single-mindedness, lack of practical skills',
        examples: 'Zeus (The Iliad), Dr. Emmett Brown (Back to the Future), Dr. Moreau (The Island of Dr. Moreau), Dr. Victor Frankenstein (Frankenstein)',
        label: 'STABILITY',
    },
    {
        title: 'Ruler',
        description: 'A character with legal or emotional power over others.',
        strengths:  'omnipotence, status, resources',
        weaknesses: 'aloofness, disliked by others, out of touch',
        examples: 'Creon (Oedipus Rex), King Lear (King Lear), Aunt Sally (The Adventures of Huckleberry Finn), Tony Soprano (The Sopranos)',
        label: 'STABILITY',
    },
    {
        title: 'Caregiver',
        description: 'A character who continually supports others and makes sacrifices on their behalf.',
        strengths:  'honorable, selfless, loyal',
        weaknesses: 'lacking personal ambition or leadership',
        examples: 'Dolly Oblonsky (Anna Karenina), Calpurnia (To Kill a Mockingbird), Samwell Tarly (The Game of Thrones series), Mary Poppins (Mary Poppins)',
        label: 'STABILITY',
    },
    {
        title: 'Everyman',
        description: 'A relatable character who feels recognizable from daily life.',
        strengths:  'grounded, salt-of-the-earth, relatable',
        weaknesses: 'lacking special powers, often unprepared for what’s to come',
        examples: 'Bilbo Baggins (The Hobbit), Leopold Bloom (Ulysses), Leslie Knope (Parks & Recreation), Winston Smith (1984)',
        label: 'BELONGING',
    },
    {
        title: 'Jester',
        description: 'A funny character or trickster who provides comic relief, but may also speak important truths.',
        strengths:  'funny, disarming, insightful',
        weaknesses: 'can be obnoxious and superficial',
        examples: 'Sir John Falstaff (Henry V), King Lear’s Fool (King Lear), Frank and Estelle Costanza (Seinfeld), R2D2 and C-3PO (Star Wars)',
        label: 'BELONGING',
    },
    {
        title: 'Lover',
        description: 'The romantic lead who’s guided by the heart.',
        strengths:  'humanism, passion, conviction',
        weaknesses: 'naivete, irrationality',
        examples: 'Romeo and Juliet (Romeo and Juliet), Noah Calhoun (The Notebook), Scarlett O’Hara (Gone With the Wind), Belle (Beauty and the Beast)',
        label: 'BELONGING',
    },
  ];

const labels = [
    {
        title: 'MASTERY',
        description: 'Leave a Mark on the World',
        details: 'Those with this orientation want to leave a mark on the world. The goal of these characters is to create something of substance that they can leave behind. They want their ideas, thoughts, and beliefs to survive long after they do. They are not hoping for fame, but instead believe they have something to say that can positively influence others now and in the future.',
    },
    {
        title: 'INDEPENDENCE',
        description: 'Yearn for Paradise',
        details: 'The primary goal of the independent archetypes is to fulfill their yearning for paradise. The core requirement for reaching paradise is being free from conflict and being directed by others. These individuals are flexible and open to experience are always searching for new ways of doing thing and seek to expand their skills. This type of characters loves pursuing new things without anyone dictating what they must focus on.'
    },
    {
        title: 'STABILITY',
        description: 'Provide Structure to the World',
        details: 'The goal of stability oriented individuals is to provide structure to the world. They are concerned with making the process of their doing rule and convention based and they often research the trends and guidelines that are likely to contribute to success. They often track progress and outcomes and use research and data analysis to determine which rules actually govern success and which may be more anecdotal but not very effective. They may follow certain practices which helps them and other people to improve at something or succeed in reaching their goals.',
    },
    {
        title: 'BELONGING',
        description: 'Connect to others',
        details: 'The social archetypes strive to connect with others. They long for human contact and to be a part of supportive communities including a community where there are positive relationships, collaboration and people helping each other out. These individuals will never try to get ahead by stabbing someone else in the back or through betrayal. They give their trust easily and assume that others in the communities they belong to are trustworthy as well.'
    },
];

export { archetypes, labels }