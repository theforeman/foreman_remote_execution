export const getLastOutputTimestamp = output =>
  output.length ? output[output.length - 1].timestamp : null;

export const mergeOutput = (currentOutput, newOutput) => {
  if (!newOutput.length) return currentOutput;

  const mergedOutput = [...currentOutput];
  const appendedOutput = newOutput.map(lineSet => ({ ...lineSet }));
  const previousLineSet = mergedOutput[mergedOutput.length - 1];
  const firstNewLineSet = appendedOutput[0];

  if (previousLineSet && !previousLineSet.output.endsWith('\n')) {
    const firstCompleteLine = firstNewLineSet.output.match(/^.*\n/);
    if (firstCompleteLine) {
      mergedOutput[mergedOutput.length - 1] = {
        ...previousLineSet,
        output: previousLineSet.output + firstCompleteLine[0],
      };
      appendedOutput[0] = {
        ...firstNewLineSet,
        output: firstNewLineSet.output.slice(firstCompleteLine[0].length),
      };
    }
  }

  return [...mergedOutput, ...appendedOutput];
};
