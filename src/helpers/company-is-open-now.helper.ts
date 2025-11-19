import { Company, OpeningHour } from '@prisma/client';

type CompanyWithHours = Company & { openingHours?: OpeningHour[] };

const isOpenNow = (company: CompanyWithHours): boolean => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = domingo, 6 = sábado
  const currentTime = now.toTimeString().slice(0, 5); // "HH:mm"

  const todaysHours = (company.openingHours || []).filter(
    (h) => h.dayOfWeek === dayOfWeek && !h.closed && h.startTime && h.endTime,
  );

  // Verifica se o horário atual está dentro de algum intervalo
  const isOpen =
    todaysHours.some(
      (h) => currentTime >= h.startTime && currentTime <= h.endTime,
    ) || company.isAlwaysOpening;

  return isOpen;
};

export default isOpenNow;
