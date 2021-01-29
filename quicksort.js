async function quickSort(arr, start, end) {
    if (start >= end) {
        return
    }

    var pivot = await partition(arr, start, end);
    sortedIndexes[pivot] = 1;
    await sleep(sleepDuration);
    drawArray(arr, pivot);

    await Promise.all([
        quickSort(arr, start, pivot),
        quickSort(arr, pivot + 1, end)
    ]);
}

async function partition(arr, start, end) {
    var i = start - 1
    var j = start
    var pivot = arr[end - 1]

    while (j < end - 1) {
        if(arr[j] <= pivot) {
            i++
            // swap i and j
            var temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp

            await sleep(sleepDuration);
            drawArray(arr, j)
        }
        j++;
    }

    // swap i+1 and pivot
    i++
    arr[end - 1] = arr[i]
    arr[i] = pivot
    return i
}

export {quickSort};