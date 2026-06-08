import type { UserProfile, GroupCategory, TopWeekItem } from "@/types"

const futureDate = new Date(Date.now() + 86400000).toISOString()

export const ALL_DEMO_USERS: UserProfile[] = [
  { id: 1, name: "Анна", age: 24, img: "/demo/people/anna.png", hint: "woman portrait", online: true, distance: 2, match: 87, city: "Москва", zodiac: "Лев", interests: ["Фотография", "Путешествия", "Кофе", "Музыка", "Спорт"], bio: "Люблю закаты, хороший кофе и интересные разговоры.", height: 172, goal: "Серьезные отношения", gender: "female", lookingFor: "male", superLikes: 5, boost: { boostedUntil: futureDate }, circadian: "lark" },
  { id: 2, name: "Александр", age: 26, img: "/demo/people/maxim.png", hint: "man portrait", online: true, distance: 3, match: 95, city: "Москва", zodiac: "Овен", interests: ["Путешествия", "Кофе", "Спорт"], bio: "Всегда в движении. Ищу ту, кто разделит мою страсть к горам и кофе.", height: 185, goal: "Серьезные отношения", gender: "male", lookingFor: "female", superLikes: 0, boost: { boostedUntil: null }, circadian: "owl" },
  { id: 3, name: "Елена", age: 26, img: "/demo/people/elena.png", hint: "woman portrait", online: false, distance: 3, match: 81, city: "Москва", zodiac: "Рыбы", interests: ["Искусство", "Чтение", "Кулинария"], bio: "Ищу кого-то, кто любит музеи и долгие прогулки.", height: 168, goal: "Свидания", gender: "female", lookingFor: "male", superLikes: 0, boost: { boostedUntil: null }, circadian: "owl" },
  { id: 4, name: "Михаил", age: 28, img: "/demo/people/ivan.png", hint: "man portrait", online: false, distance: 5, match: 89, city: "Москва", zodiac: "Скорпион", interests: ["Музыка", "Кофе", "Фотография"], bio: "Играю на гитаре, варю лучший эспрессо. Давай сходим на концерт?", height: 182, goal: "Свидания", gender: "male", lookingFor: "female", superLikes: 0, boost: { boostedUntil: null }, circadian: "owl" },
  { id: 5, name: "София", age: 22, img: "/demo/people/sophia.png", hint: "woman portrait", online: true, distance: 7, match: 88, city: "Москва", zodiac: "Дева", interests: ["Музыка", "Творчество", "Фотография"], bio: "Мечтаю собрать свою группу и объехать мир.", height: 165, goal: "Просто общение", gender: "female", lookingFor: "male", superLikes: 0, boost: { boostedUntil: null }, circadian: "lark" },
  { id: 6, name: "Артем", age: 25, img: "/demo/people/artem.png", hint: "man portrait", online: true, distance: 4, match: 84, city: "Москва", zodiac: "Близнецы", interests: ["Спорт", "Музыка", "Путешествия"], bio: "Кодю днем, бегаю вечером. Люблю умные разговоры.", height: 178, goal: "Новые друзья", gender: "male", lookingFor: "female", superLikes: 0, boost: { boostedUntil: null }, circadian: "lark" },
  { id: 7, name: "Мария", age: 29, img: "/demo/people/anna.png", hint: "woman portrait", online: true, distance: 1, match: 94, city: "Москва", zodiac: "Скорпион", interests: ["Йога", "Природа", "Путешествия"], bio: "Люблю готовить полезную еду и ходить в походы.", height: 170, goal: "Серьезные отношения", gender: "female", lookingFor: "male", superLikes: 0, boost: { boostedUntil: null }, circadian: "lark" },
  { id: 8, name: "Иван", age: 27, img: "/demo/people/ivan.png", hint: "man portrait", online: false, distance: 8, match: 91, city: "Москва", zodiac: "Стрелец", interests: ["Фотография", "Путешествия", "Спорт"], bio: "Пейзажный фотограф. Мечтаю о поездке в Исландию.", height: 188, goal: "Серьезные отношения", gender: "male", lookingFor: "female", superLikes: 0, boost: { boostedUntil: null }, circadian: "owl" },
  { id: 9, name: "Ксения", age: 23, img: "/demo/people/sophia.png", hint: "woman portrait", online: true, distance: 6, match: 83, city: "Москва", zodiac: "Козерог", interests: ["Рукоделие", "Дизайн", "Искусство"], bio: "Жизнь слишком коротка, чтобы носить скучную одежду.", height: 174, goal: "Серьезные отношения", gender: "female", lookingFor: "male", superLikes: 0, boost: { boostedUntil: null }, circadian: "owl" },
  { id: 10, name: "Никита", age: 30, img: "/demo/people/maxim.png", hint: "man portrait", online: false, distance: 6, match: 78, city: "Москва", zodiac: "Водолей", interests: ["Кофе", "Музыка", "Фотография"], bio: "Ценю искренность и хороший юмор. Люблю открывать новые кофейни.", height: 180, goal: "Просто общение", gender: "male", lookingFor: "female", superLikes: 0, boost: { boostedUntil: null }, circadian: "lark" },
  { id: 11, name: "Дмитрий", age: 32, img: "/demo/people/maxim.png", hint: "man portrait", online: true, distance: 2, match: 92, city: "Москва", zodiac: "Телец", interests: ["Спорт", "Кофе", "Путешествия"], bio: "Люблю активный отдых и продуктивные утра. Ищу серьезные отношения.", height: 184, goal: "Серьезные отношения", gender: "male", lookingFor: "female", superLikes: 0, boost: { boostedUntil: null }, circadian: "lark" },
  { id: 12, name: "Максим", age: 29, img: "/demo/people/maxim.png", hint: "man fashion", online: false, distance: 4, match: 86, city: "Москва", zodiac: "Козерог", interests: ["Музыка", "Фотография", "Спорт"], bio: "Меломан и эстет. Люблю находить красоту в мелочах.", height: 179, goal: "Свидания", gender: "male", lookingFor: "female", superLikes: 0, boost: { boostedUntil: null }, circadian: "owl" },
  { id: 13, name: "Андрей", age: 31, img: "/demo/people/ivan.png", hint: "man professional", online: true, distance: 7, match: 83, city: "Москва", zodiac: "Весы", interests: ["Путешествия", "Кофе", "Музыка"], bio: "Архитектор. Ищу вдохновение и интересного собеседника.", height: 181, goal: "Новые друзья", gender: "male", lookingFor: "female", superLikes: 0, boost: { boostedUntil: null }, circadian: "lark" },
  { id: 14, name: "Игорь", age: 24, img: "/demo/people/artem.png", hint: "man fitness", online: true, distance: 1, match: 94, city: "Москва", zodiac: "Рак", interests: ["Спорт", "Фотография", "Путешествия"], bio: "Жизнь — это приключение. Давай напишем свою историю вместе?", height: 176, goal: "Серьезные отношения", gender: "male", lookingFor: "female", superLikes: 0, boost: { boostedUntil: null }, circadian: "owl" },
  { id: 15, name: "Виктор", age: 35, img: "/demo/people/ivan.png", hint: "man intellectual", online: false, distance: 9, match: 81, city: "Москва", zodiac: "Дева", interests: ["Кофе", "Музыка", "Спорт"], bio: "Спокойный, надежный, ценю уют и хороший джаз.", height: 183, goal: "Свидания", gender: "male", lookingFor: "female", superLikes: 0, boost: { boostedUntil: null }, circadian: "lark" },
]

export const TOP_OF_THE_WEEK: TopWeekItem[] = [
  { id: "top1", name_ru: "Клуб любителей котиков", name_en: "Cat Lovers Club", members: 12345, img: "https://picsum.photos/seed/top_week_1/600/400" },
  { id: "top2", name_ru: "Обсуждаем кино", name_en: "Movie Discussions", members: 8765, img: "https://picsum.photos/seed/top_week_2/600/400" },
  { id: "top3", name_ru: "Путешествия на выходные", name_en: "Weekend Travelers", members: 7654, img: "https://picsum.photos/seed/top_week_3/600/400" },
  { id: "top4", name_ru: "React-разработчики", name_en: "React Developers", members: 6543, img: "https://picsum.photos/seed/top_week_4/600/400" },
]

export const GROUP_CATEGORIES: GroupCategory[] = [
  {
    id: "music", name_ru: "Музыка", name_en: "Music", icon: "Music", img: "https://picsum.photos/seed/cat_music/600/400", hint: "concert crowd",
    subgroups: [
      { id: 101, name_ru: "Хип-хоп", name_en: "Hip-hop", members: 150, online: 25 }, { id: 102, name_ru: "Рок", name_en: "Rock", members: 200, online: 40 },
      { id: 103, name_ru: "Электроника", name_en: "Electronic", members: 180, online: 30 }, { id: 104, name_ru: "Джаз & Блюз", name_en: "Jazz & Blues", members: 80, online: 10 },
      { id: 105, name_ru: "Классика", name_en: "Classical", members: 60, online: 5 }, { id: 106, name_ru: "Инди", name_en: "Indie", members: 120, online: 20 },
      { id: 107, name_ru: "Поп", name_en: "Pop", members: 300, online: 50 }, { id: 108, name_ru: "Метал", name_en: "Metal", members: 90, online: 15 },
      { id: 109, name_ru: "K-Pop", name_en: "K-Pop", members: 250, online: 60 }, { id: 110, name_ru: "Авторская песня", name_en: "Bard Song", members: 70, online: 8 },
      { id: 111, name_ru: "Техно", name_en: "Techno", members: 160, online: 28 }, { id: 112, name_ru: "R&B / Соул", name_en: "R&B / Soul", members: 130, online: 22 },
      { id: 113, name_ru: "Фолк", name_en: "Folk", members: 50, online: 7 }, { id: 114, name_ru: "Саундтреки", name_en: "Soundtracks", members: 110, online: 18 },
      { id: 115, name_ru: "Reggae", name_en: "Reggae", members: 85, online: 14 }, { id: 116, name_ru: "Кантри", name_en: "Country", members: 40, online: 4 },
      { id: 117, name_ru: "Панк-рок", name_en: "Punk Rock", members: 95, online: 17 }, { id: 118, name_ru: "Хаус", name_en: "House", members: 140, online: 26 },
      { id: 119, name_ru: "Транс", name_en: "Trance", members: 135, online: 24 }, { id: 120, name_ru: "Амбиент", name_en: "Ambient", members: 75, online: 9 },
    ]
  },
  {
    id: "sports", name_ru: "Спорт", name_en: "Sports", icon: "Dumbbell", img: "https://picsum.photos/seed/cat_sports/600/400", hint: "stadium sports",
    subgroups: [
      { id: 201, name_ru: "Футбол", name_en: "Football", members: 400, online: 80 }, { id: 202, name_ru: "Баскетбол", name_en: "Basketball", members: 250, online: 50 },
      { id: 203, name_ru: "Бег", name_en: "Running", members: 180, online: 35 }, { id: 204, name_ru: "Йога", name_en: "Yoga", members: 300, online: 60 },
      { id: 205, name_ru: "Плавание", name_en: "Swimming", members: 150, online: 20 }, { id: 206, name_ru: "Боевые искусства", name_en: "Martial Arts", members: 120, online: 25 },
      { id: 207, name_ru: "Теннис", name_en: "Tennis", members: 100, online: 15 }, { id: 208, name_ru: "Велоспорт", name_en: "Cycling", members: 130, online: 18 },
      { id: 209, name_ru: "Зимние виды", name_en: "Winter Sports", members: 90, online: 12 }, { id: 210, name_ru: "Шахматы", name_en: "Chess", members: 70, online: 10 },
      { id: 211, name_ru: "Хоккей", name_en: "Hockey", members: 190, online: 38 }, { id: 212, name_ru: "Волейбол", name_en: "Volleyball", members: 160, online: 30 },
      { id: 213, name_ru: "Фитнес и тренажерка", name_en: "Fitness & Gym", members: 350, online: 70 }, { id: 214, name_ru: "Автоспорт", name_en: "Motorsport", members: 110, online: 22 },
      { id: 215, name_ru: "Скейтбординг", name_en: "Skateboarding", members: 80, online: 16 }, { id: 216, name_ru: "Настольный теннис", name_en: "Table Tennis", members: 95, online: 19 },
      { id: 217, name_ru: "Гольф", name_en: "Golf", members: 50, online: 5 }, { id: 218, name_ru: "Конный спорт", name_en: "Equestrian", members: 60, online: 8 },
      { id: 219, name_ru: "Сёрфинг", name_en: "Surfing", members: 40, online: 6 }, { id: 220, name_ru: "Скалолазание", name_en: "Climbing", members: 75, online: 14 },
    ]
  },
  {
    id: "creativity", name_ru: "Творчество", name_en: "Creativity", icon: "Palette", img: "https://picsum.photos/seed/cat_creativity/600/400", hint: "art supplies",
    subgroups: [
      { id: 301, name_ru: "Рисование", name_en: "Drawing", members: 220, online: 45 }, { id: 302, name_ru: "Фотография", name_en: "Photography", members: 350, online: 70 },
      { id: 303, name_ru: "UI/UX Дизайн", name_en: "UI/UX Design", members: 280, online: 60 }, { id: 304, name_ru: "Писательство", name_en: "Writing", members: 150, online: 25 },
      { id: 305, name_ru: "Рукоделие", name_en: "Crafts", members: 180, online: 30 }, { id: 306, name_ru: "Скульптура", name_en: "Sculpture", members: 50, online: 8 },
      { id: 307, name_ru: "Каллиграфия", name_en: "Calligraphy", members: 90, online: 15 }, { id: 308, name_ru: "Актерское мастерство", name_en: "Acting", members: 110, online: 20 },
      { id: 309, name_ru: "Создание видео", name_en: "Video Making", members: 160, online: 35 }, { id: 310, name_ru: "Флористика", name_en: "Floristry", members: 70, online: 12 },
      { id: 311, name_ru: "Графический дизайн", name_en: "Graphic Design", members: 240, online: 48 }, { id: 312, name_ru: "Игра на гитаре", name_en: "Guitar Playing", members: 190, online: 38 },
      { id: 313, name_ru: "Мода и шитье", name_en: "Fashion & Sewing", members: 140, online: 28 }, { id: 314, name_ru: "Гончарное дело", name_en: "Pottery", members: 60, online: 10 },
      { id: 315, name_ru: "Stand-up комедия", name_en: "Stand-up Comedy", members: 80, online: 18 }, { id: 316, name_ru: "Создание украшений", name_en: "Jewelry Making", members: 100, online: 21 },
      { id: 317, name_ru: "3D-моделирование", name_en: "3D Modeling", members: 130, online: 27 }, { id: 318, name_ru: "DJ-инг", name_en: "DJing", members: 95, online: 19 },
      { id: 319, name_ru: "Поэзия", name_en: "Poetry", members: 85, online: 16 }, { id: 320, name_ru: "Ландшафтный дизайн", name_en: "Landscape Design", members: 55, online: 9 },
    ]
  },
  {
    id: "gaming", name_ru: "Игры", name_en: "Gaming", icon: "Gamepad2", img: "https://picsum.photos/seed/cat_gaming/600/400", hint: "video games",
    subgroups: [
      { id: 401, name_ru: "PC Гейминг", name_en: "PC Gaming", members: 500, online: 120 }, { id: 402, name_ru: "PlayStation", name_en: "PlayStation", members: 450, online: 100 },
      { id: 403, name_ru: "Xbox", name_en: "Xbox", members: 300, online: 70 }, { id: 404, name_ru: "Nintendo Switch", name_en: "Nintendo Switch", members: 250, online: 50 },
      { id: 405, name_ru: "Мобильные игры", name_en: "Mobile Games", members: 600, online: 150 }, { id: 406, name_ru: "Настольные игры", name_en: "Board Games", members: 200, online: 40 },
      { id: 407, name_ru: "VR/AR", name_en: "VR/AR", members: 80, online: 15 }, { id: 408, name_ru: "Киберспорт", name_en: "eSports", members: 350, online: 80 },
      { id: 409, name_ru: "Ретро-гейминг", name_en: "Retro Gaming", members: 100, online: 20 }, { id: 410, name_ru: "Стриминг", name_en: "Streaming", members: 180, online: 45 },
      { id: 411, name_ru: "MMORPG", name_en: "MMORPG", members: 420, online: 95 }, { id: 412, name_ru: "Инди-игры", name_en: "Indie Games", members: 220, online: 48 },
      { id: 413, name_ru: "RPG", name_en: "RPG", members: 380, online: 85 }, { id: 414, name_ru: "Стратегии", name_en: "Strategy Games", members: 260, online: 55 },
      { id: 415, name_ru: "Шутеры", name_en: "Shooters", members: 480, online: 110 }, { id: 416, name_ru: "Симуляторы", name_en: "Simulators", members: 190, online: 39 },
      { id: 417, name_ru: "Файтинги", name_en: "Fighting Games", members: 140, online: 28 }, { id: 418, name_ru: "Кооперативные игры", name_en: "Co-op Games", members: 330, online: 75 },
      { id: 419, name_ru: "Головоломки", name_en: "Puzzles", members: 120, online: 24 }, { id: 420, name_ru: "D&D и ролёвки", name_en: "D&D and Role-playing", members: 170, online: 35 },
    ]
  },
]
