/*
KennisSprint dataset
© Joas de Wit
2026
*/
export const historyHavo3Course = {
  id: "geschiedenis-havo-3",
  subject: "geschiedenis",
  level: "havo",
  grade: "3",
  title: "Geschiedenis 3 havo",

  chapters: [
    {
      id: "havo3-h1",
      subjectId: "geschiedenis",
      title: "Demo hoofdstuk 1"
    },
    {
      id: "havo3-h2",
      subjectId: "geschiedenis",
      title: "Demo hoofdstuk 2"
    }
  ],

  datasets: {
    terms: [
      {
        id: "havo3-001",
        subjectId: "geschiedenis",
        chapterId: "havo3-h1",
        type: "begrip",
        prompt: "demobegrip 1",
        answer: "Dit is een testbegrip voor Geschiedenis 3 havo."
      },
      {
        id: "havo3-002",
        subjectId: "geschiedenis",
        chapterId: "havo3-h1",
        type: "begrip",
        prompt: "demobegrip 2",
        answer: "Dit is een tweede testbegrip voor Geschiedenis 3 havo."
      },
      {
        id: "havo3-003",
        subjectId: "geschiedenis",
        chapterId: "havo3-h1",
        type: "begrip",
        prompt: "demobegrip 3",
        answer: "Nog een dummybegrip voor de oefentrainer."
      },
      {
        id: "havo3-004",
        subjectId: "geschiedenis",
        chapterId: "havo3-h2",
        type: "begrip",
        prompt: "demobegrip 4",
        answer: "Dit begrip hoort bij hoofdstuk 2."
      },
      {
        id: "havo3-005",
        subjectId: "geschiedenis",
        chapterId: "havo3-h2",
        type: "begrip",
        prompt: "demobegrip 5",
        answer: "Extra testbegrip om voldoende vragen te hebben."
      },
      {
        id: "havo3-006",
        subjectId: "geschiedenis",
        chapterId: "havo3-h2",
        type: "begrip",
        prompt: "demobegrip 6",
        answer: "Nog een voorbeeldbegrip voor de quiz."
      }
    ],

    years: [
      {
        id: "havo3-y1",
        chapterId: "havo3-h1",
        year: "1789",
        event: "Franse Revolutie begint (dummyvoorbeeld)"
      },
      {
        id: "havo3-y2",
        chapterId: "havo3-h1",
        year: "1815",
        event: "Slag bij Waterloo (dummyvoorbeeld)"
      },
      {
        id: "havo3-y3",
        chapterId: "havo3-h2",
        year: "1848",
        event: "Grondwet van Thorbecke (dummyvoorbeeld)"
      },
      {
        id: "havo3-y4",
        chapterId: "havo3-h2",
        year: "1870",
        event: "Duitsland wordt een eenheidsstaat (dummyvoorbeeld)"
      }
    ],

    persons: [
      {
        id: "havo3-p1",
        chapterId: "havo3-h1",
        name: "Napoleon",
        description: "Franse leider die grote delen van Europa veroverde."
      },
      {
        id: "havo3-p2",
        chapterId: "havo3-h1",
        name: "Lodewijk XVI",
        description: "Franse koning tijdens het begin van de Franse Revolutie."
      },
      {
        id: "havo3-p3",
        chapterId: "havo3-h2",
        name: "Thorbecke",
        description: "Nederlandse staatsman die een belangrijke rol speelde bij de grondwet van 1848."
      },
      {
        id: "havo3-p4",
        chapterId: "havo3-h2",
        name: "Bismarck",
        description: "Pruisische politicus die belangrijk was voor de Duitse eenwording."
      }
    ]
  },

  modes: [
    {
      id: "term-to-answer",
      label: "Begrip → beschrijving",
      dataset: "terms"
    },
    {
      id: "answer-to-term",
      label: "Beschrijving → begrip",
      dataset: "terms"
    },
    {
      id: "years",
      label: "Jaartal → gebeurtenis",
      dataset: "years"
    },
    {
      id: "event-years",
      label: "Gebeurtenis → jaartal",
      dataset: "years"
    },
    {
      id: "person-to-description",
      label: "Persoon → beschrijving",
      dataset: "persons",
      questionLabel: "Persoon",
      sessionModeLabel: "Persoon → beschrijving",
      questionField: "name",
      answerField: "description"
    },
    {
      id: "description-to-person",
      label: "Beschrijving → persoon",
      dataset: "persons",
      questionLabel: "Beschrijving",
      sessionModeLabel: "Beschrijving → persoon",
      questionField: "description",
      answerField: "name"
    }
  ]
};
