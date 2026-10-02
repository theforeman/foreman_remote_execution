export const getLastOutputTimestamp = output =>
  output.length ? output[output.length - 1].timestamp : null;

export const normalizeOutput = output =>
  output.reduce((normalized, lineSet) => {
    const previousLineSet = normalized[normalized.length - 1];

    if (
      previousLineSet &&
      previousLineSet.output_type === lineSet.output_type &&
      !previousLineSet.output.endsWith('\n')
    ) {
      const firstCompleteLine = lineSet.output.match(/^[^\n]*\n/);
      if (firstCompleteLine) {
        normalized[normalized.length - 1] = {
          ...previousLineSet,
          output: previousLineSet.output + firstCompleteLine[0],
        };

        const remainder = lineSet.output.slice(firstCompleteLine[0].length);
        if (remainder) normalized.push({ ...lineSet, output: remainder });
        return normalized;
      }
    }

    normalized.push(lineSet);
    return normalized;
  }, []);

export const mergeOutput = (currentOutput, newOutput) => {
  if (!newOutput.length) return currentOutput;
  return normalizeOutput([...currentOutput, ...newOutput]);
};
