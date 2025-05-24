export function validateDateOfBirth(dateString: string): string | null {
  const date = new Date(dateString);
  const today = new Date();

  if (isNaN(date.getTime())) return "Data de nascimento inválida";
  if (date > today) return "Data de nascimento não pode estar no futuro";

  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  const dayDiff = today.getDate() - date.getDate();
  const fullAge = age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);

  if (fullAge < 18) return "O usuário deve ter no mínimo 18 anos";
  if (fullAge > 100) return "Idade superior a 100 anos não é permitida";

  return null;
}
