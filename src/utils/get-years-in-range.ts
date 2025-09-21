export function getYearsInRange(startYear: number, endYear: number): number[] {
  if (endYear < startYear) {
    throw new Error('End year must be greater than or equal to start year')
  }

  return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
}
