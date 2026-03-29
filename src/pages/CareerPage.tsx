import CareerClientsSection from '@/components/CareerClientsSection.tsx';
import CareerHero from '@/components/CareerHero.tsx';
import CareerPolaroids from '@/components/CareerPolaroids.tsx';
import CareerStats from '@/components/CareerStats.tsx';
import SectionHeader from '@/components/SectionHeader.tsx';

const CONTAINER = 'max-w-[1280px] mx-auto px-4';

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-background">

      <section className="min-h-screen bg-surface">
        <div className={`${CONTAINER} pt-28 pb-16 flex flex-col gap-24`}>
          <CareerHero />
          <CareerClientsSection />

          <div className="flex flex-col gap-8">
            <SectionHeader eyebrow="компания" title="HFLabs в цифрах" />
            <CareerStats />
            <div className="w-full bg-background p-4 text-3xl rounded-2xl text-center">
              Входим в реестр аккредитованных IT-компаний
            </div>
          </div>
        </div>
      </section>

      <CareerPolaroids />

      <section id="vacancies" className="w-full bg-surface mt-4">
        <div className={CONTAINER}>
          <div className="py-16 flex justify-center">
            <SectionHeader
              eyebrow="вакансии"
              title="Ждем именно тебя в нашей команде!"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
