const splitAt = 4 * 4000 - 200; // ~4000 tokens

// Split data into chunks that are small enough to be able to be processed by chat gpt
export function chunkData(requiredData: { [year: string]: string }) {
  const splitAffiliations: {
    [year: string]: Array<string>;
  } = {};
  Object.keys(requiredData).map((key) => {
    if (requiredData[key].length < splitAt) {
      splitAffiliations[key] = [requiredData[key]];
      return;
    }

    const allFragments = requiredData[key].split("@@");
    const mergedFragments = [];
    let currentMerge = "";
    for (const fragment of allFragments) {
      if (currentMerge.length + fragment.length > splitAt) {
        mergedFragments.push(currentMerge);
        currentMerge = "";
      }

      currentMerge =
        currentMerge === "" ? fragment : currentMerge + "@@" + fragment;
    }
    splitAffiliations[key] = mergedFragments;
  });

  return splitAffiliations;
}
