
export type AttachmentStyle = 'secure' | 'anxious' | 'avoidant';

export const ATTACHMENT_STYLE_QUESTIONS = [
  {
    id: 'q1',
    text: 'attach.q1.text',
    options: [
      { id: 'a', text: 'attach.q1.a', style: 'secure' as AttachmentStyle },
      { id: 'b', text: 'attach.q1.b', style: 'anxious' as AttachmentStyle },
      { id: 'c', text: 'attach.q1.c', style: 'avoidant' as AttachmentStyle },
    ],
  },
  {
    id: 'q2',
    text: 'attach.q2.text',
    options: [
      { id: 'a', text: 'attach.q2.a', style: 'secure' as AttachmentStyle },
      { id: 'b', text: 'attach.q2.b', style: 'anxious' as AttachmentStyle },
      { id: 'c', text: 'attach.q2.c', style: 'avoidant' as AttachmentStyle },
    ],
  },
  {
    id: 'q3',
    text: 'attach.q3.text',
    options: [
      { id: 'a', text: 'attach.q3.a', style: 'secure' as AttachmentStyle },
      { id: 'b', text: 'attach.q3.b', style: 'anxious' as AttachmentStyle },
      { id: 'c', text: 'attach.q3.c', style: 'avoidant' as AttachmentStyle },
    ],
  },
    {
    id: 'q4',
    text: 'attach.q4.text',
    options: [
      { id: 'a', text: 'attach.q4.a', style: 'secure' as AttachmentStyle },
      { id: 'b', text: 'attach.q4.b', style: 'anxious' as AttachmentStyle },
      { id: 'c', text: 'attach.q4.c', style: 'avoidant' as AttachmentStyle },
    ],
  },
];

export function calculateAttachmentStyle(answers: { [questionId: string]: AttachmentStyle }): AttachmentStyle {
  const counts: { [key in AttachmentStyle]: number } = {
    secure: 0,
    anxious: 0,
    avoidant: 0,
  };

  for (const questionId in answers) {
    const style = answers[questionId];
    if (style in counts) {
      counts[style]++;
    }
  }

  let maxCount = 0;
  let resultStyle: AttachmentStyle = 'secure';

  for (const style in counts) {
    if (counts[style as AttachmentStyle] > maxCount) {
      maxCount = counts[style as AttachmentStyle];
      resultStyle = style as AttachmentStyle;
    }
  }

  return resultStyle;
}

export const ATTACHMENT_STYLE_INFO: { [key in AttachmentStyle]: { labelKey: string; descKey: string; emoji: string; } } = {
    secure: {
        labelKey: 'attach.style.secure.label',
        descKey: 'attach.style.secure.desc',
        emoji: '✅'
    },
    anxious: {
        labelKey: 'attach.style.anxious.label',
        descKey: 'attach.style.anxious.desc',
        emoji: '😟'
    },
    avoidant: {
        labelKey: 'attach.style.avoidant.label',
        descKey: 'attach.style.avoidant.desc',
        emoji: '💨'
    }
}
