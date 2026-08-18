export const getLastOutputTimestamp = output =>
  output.length ? output[output.length - 1].timestamp : null;

export const mergeOutput = (currentOutput, newOutput) => {
  if (!newOutput.length) return currentOutput;

  const previousLineSet = currentOutput[currentOutput.length - 1];
  const firstNewLineSet = newOutput[0];

  if (
    previousLineSet &&
    previousLineSet.output_type === firstNewLineSet.output_type &&
    !previousLineSet.output.endsWith('\n')
  ) {
    const firstCompleteLine = firstNewLineSet.output.match(/^.*\n/);
    if (firstCompleteLine) {
      const remainder = firstNewLineSet.output.slice(
        firstCompleteLine[0].length
      );
      return [
        ...currentOutput.slice(0, -1),
        {
          ...previousLineSet,
          output: previousLineSet.output + firstCompleteLine[0],
        },
        ...(remainder ? [{ ...firstNewLineSet, output: remainder }] : []),
        ...newOutput.slice(1),
      ];
    }
  }

  return [...currentOutput, ...newOutput];
};
