import "dotenv/config";
import argon2 from "argon2";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = pkg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is missing");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // --- Admin ---
  const email = process.env.ADMIN_EMAIL ?? "admin@plantis.pl";
  const password = process.env.ADMIN_PASSWORD ?? "zmien_mnie_123!";

  let admin = await prisma.user.findUnique({ where: { email } });
  if (!admin) {
    const passwordHash = await argon2.hash(password);
    admin = await prisma.user.create({
      data: { email, passwordHash, name: "Administrator", role: "ADMIN" },
    });
    console.log(`✓ Admin created: ${admin.email}`);
  } else {
    console.log(`✓ Admin already exists: ${admin.email}`);
  }

  // --- Test user ---
  let testUser = await prisma.user.findUnique({ where: { email: "user@plantis.pl" } });
  if (!testUser) {
    const passwordHash = await argon2.hash("haslo123!");
    testUser = await prisma.user.create({
      data: { email: "user@plantis.pl", passwordHash, name: "Kasia Zielona", role: "USER" },
    });
    console.log(`✓ Test user created: ${testUser.email}`);
  }

  // --- Sample listings ---
  const existing = await prisma.listing.count({ where: { userId: testUser.id } });
  if (existing >= 12) {
    console.log(`✓ Sample listings already exist (${existing})`);
    return;
  }

  const listings = [
    {
      title: "Monstera Deliciosa — duża, zdrowa",
      description: "Piękna monstera z dziurkami na liściach, ok. 80 cm wysokości. Hodowana od 2 lat, bardzo zdrowa, nie ma szkodników. Oddaję bo kupuję większą.",
      city: "Warszawa", type: "PLANT", deliveryMode: "BOTH",
      watering: "MEDIUM", light: "MEDIUM", position: "INDOOR",
      height: "LARGE", difficulty: "EASY", petFriendly: false,
    },
    {
      title: "Pothos złoty — sadzonki w wodzie",
      description: "Kilka sadzonek pothosa złotego ukorzenionych w wodzie, gotowych do przesadzenia. Bardzo łatwa roślina, polecam dla początkujących.",
      city: "Kraków", type: "CUTTING", deliveryMode: "SHIPPING",
      watering: "LOW", light: "LOW", position: "INDOOR",
      height: "SMALL", difficulty: "EASY", petFriendly: false,
    },
    {
      title: "Kaktus Cereus — wysoki, słupowy",
      description: "Cereus peruvianus, ok. 60 cm. Rośnie bardzo wolno, idealne na słoneczny parapet. Nie podlewany przeze mnie częściej niż raz na 3 tygodnie.",
      city: "Wrocław", type: "PLANT", deliveryMode: "PICKUP",
      watering: "LOW", light: "FULL_SUN", position: "INDOOR",
      height: "MEDIUM", difficulty: "EASY", petFriendly: true,
    },
    {
      title: "Skrzydłokwiat — kwitnie co roku",
      description: "Spathiphyllum w doniczce 17cm, regularnie kwitnie białymi kwiatami. Oczyszcza powietrze, polecany do sypialni. Stan bardzo dobry.",
      city: "Gdańsk", type: "PLANT", deliveryMode: "PICKUP",
      watering: "HIGH", light: "LOW", position: "INDOOR",
      height: "SMALL", difficulty: "EASY", petFriendly: false,
    },
    {
      title: "Sukulenty mix — liście do ulistnienia",
      description: "Oferuję liście do ulistnienia z różnych gatunków sukulentów: Echeveria, Sedum, Pachyphytum. Około 20 sztuk w paczce. Wysyłam listem.",
      city: "Poznań", type: "LEAF", deliveryMode: "SHIPPING",
      watering: "LOW", light: "FULL_SUN", position: "BOTH",
      height: "SMALL", difficulty: "EASY", petFriendly: true,
    },
    {
      title: "Ficus lyrata — skrzypce figowe",
      description: "Duży fikus lyrata, ok. 120 cm. Stoi w moim salonie od 3 lat. Sprzedaję przez przeprowadzkę. Możliwy odbiór autem — duża roślina.",
      city: "Łódź", type: "PLANT", deliveryMode: "PICKUP",
      watering: "MEDIUM", light: "HIGH", position: "INDOOR",
      height: "LARGE", difficulty: "MEDIUM", petFriendly: true,
    },
    {
      title: "Nasiona chili Habanero",
      description: "Nasiona habanero orange z własnej uprawy. Kiełkowalność bardzo dobra (testowana). Ok. 30 nasion w kopercie. Wysyłam w ciągu 2 dni.",
      city: "Katowice", type: "SEEDS", deliveryMode: "SHIPPING",
      watering: "MEDIUM", light: "FULL_SUN", position: "OUTDOOR",
      height: "SMALL", difficulty: "MEDIUM", petFriendly: true,
    },
    {
      title: "Zamiokulkas — sadzonka z korzeniem",
      description: "Sadzonka zamiokulkasa z listkami i małym bulwiastym korzeniem, gotowa do posadzenia. Niezniszczalna roślina, toleruje zaniedbanie.",
      city: "Warszawa", type: "CUTTING", deliveryMode: "BOTH",
      watering: "LOW", light: "LOW", position: "INDOOR",
      height: "SMALL", difficulty: "EASY", petFriendly: false,
    },
    {
      title: "Paproć Boston — gęsta, bujana",
      description: "Nephrolepis exaltata, bardzo bujana, doniczka 25cm. Wymaga regularnego podlewania, ale efekty są spektakularne. Oddam w dobre ręce.",
      city: "Wrocław", type: "PLANT", deliveryMode: "PICKUP",
      watering: "HIGH", light: "MEDIUM", position: "INDOOR",
      height: "MEDIUM", difficulty: "MEDIUM", petFriendly: true,
    },
    {
      title: "Hoya carnosa — sadzonka z węzłem",
      description: "Sadzonka hoyi carnosa, kilka listków i węzeł. Ukorzeniana w wermikuli. Hoya to wdzięczna roślina — będzie kwitnąć przy dobrym świetle.",
      city: "Kraków", type: "CUTTING", deliveryMode: "SHIPPING",
      watering: "LOW", light: "HIGH", position: "INDOOR",
      height: "SMALL", difficulty: "EASY", petFriendly: true,
    },
    {
      title: "Aloes leczniczy — duży okaz",
      description: "Aloe vera, kilka lat, bardzo duży z mnóstwem odrostów. Idealne do kuchni lub łazienki. Oddam z doniczką. Tylko odbiór osobisty.",
      city: "Gdańsk", type: "PLANT", deliveryMode: "PICKUP",
      watering: "LOW", light: "HIGH", position: "BOTH",
      height: "MEDIUM", difficulty: "EASY", petFriendly: true,
    },
    {
      title: "Nasiona lawendy wąskolistnej",
      description: "Nasiona lawendy ze swojego ogrodu, zbiór 2025. Ok. 50 nasion. Lawenda pięknie pachnie i przyciąga pszczoły. Wysyłam w kopercie bąbelkowej.",
      city: "Lublin", type: "SEEDS", deliveryMode: "SHIPPING",
      watering: "LOW", light: "FULL_SUN", position: "OUTDOOR",
      height: "SMALL", difficulty: "EASY", petFriendly: true,
    },
  ];

  for (const l of listings) {
    await prisma.listing.create({
      data: { ...l, userId: testUser.id, status: "ACTIVE" } as any,
    });
  }

  console.log(`✓ Created 12 sample listings`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
