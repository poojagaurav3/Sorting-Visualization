const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const visualizationContainerHeight = 500;
const visualizationContainerWidth = 1000;
const sleepDuration = 80;
const barWidth = 9;

var running = false;

sortedIndexes = []

$(document).ready(function(){
    generateArray();
});

$("#generate-array").click(function() {
    if (running) {
        return false;
    }
    generateArray();
})

$("#merge-sort").click(async function() {
    if(running) {
        return false;
    }
    running = true;
    mergeSort(nums, 0, nums.length - 1);
    
    // draw final array
    drawArray(nums);

    running = false;
});

$("#bubble-sort").click(async function() {
    if(running) {
        return false;
    }
    running = true;
    await bubbleSort(nums);
    
    drawArray(nums);

    running = false;
})

$("#heap-sort").click(async function() {
    if(running) {
        return false;
    }
    running = true;
    await heapSort(nums);
    
    drawArray(nums);

    running = false;
})

$("#quick-sort").click(async function runQuickSort() {
    if(running) {
        return false;
    }
    running = true;
    await quickSort(nums, 0, nums.length);
    
    // draw final array
    drawArray(nums);

    running = false;
});

async function generateArray() {
    $("#visualization").css("min-height", visualizationContainerHeight);
    $("#visualization").css("width", visualizationContainerWidth);
    nums = new Array(Math.floor(visualizationContainerWidth / (barWidth + 2)));
    for (let i = 0; i < nums.length; i++) {
        nums[i] = Math.random() * visualizationContainerHeight;
        sortedIndexes[i] = -1;
    }

    for (var i = 0; i < nums.length; i++) {
        sortedIndexes[i] = 0;
    }

    // draw initial array
    drawArray(nums);
}

function drawArray(arr, idxA, idxB) {
    var vizContainer = $("#visualization");
    $(vizContainer).empty();

    for(var i = 0; i < arr.length; i++) {
        var marginTop = visualizationContainerHeight - arr[i]; 
        var bar = $("<div class='bar'></div>").height(arr[i]).css("margin-top", marginTop);
        $(bar).css("width", barWidth);
        if(i == idxA || i == idxB) {
            $(bar).css("background-color", "#E98074")
        }
        if(sortedIndexes[i] == 1) {
            $(bar).css("background-color", "#57BA98")
        }
        $(vizContainer).append(bar);
    }
};

const performSorting = async (arr) => {
    for(var i = 0; i < arr.length; i++) {
        for(var j = i; j < arr.length; j++) {
            if(arr[i] > arr[j]) {
                await sleep(sleepDuration);
                // swap
                var temp = arr[i]
                arr[i] = arr[j]
                arr[j] = temp
                
                drawArray(arr, j);
            }
        }
    }
}

async function bubbleSort(arr) {
    copiedArray = [...arr]
    copiedArray.sort(function(a, b){return a - b});
    for (var i = 0; i < arr.length - 1; i++) {
        var lastSwap = i;
        for(var j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                await sleep(sleepDuration / 2);
                // swap
                var temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp

                lastSwap = j + 1;
                drawArray(arr, j + 1)
            }
            if(copiedArray[j] == arr[j]) {
                sortedIndexes[j] = 1;
            } else {
                sortedIndexes[j] = 0;
            }

            if(copiedArray[j + 1] == arr[j + 1]) {
                sortedIndexes[j + 1] = 1;
            } else {
                sortedIndexes[j + 1] = 0;   
            }
            await sleep(sleepDuration / 2);
            drawArray(arr);
        }
    }
}

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

async function mergeSort(arr, start, end) {
    if (start >= end) {
        return
    }

    var mid = Math.floor(start + (end - start) / 2);
    await sleep(sleepDuration);
    drawArray(arr, mid);
    await Promise.all([
        mergeSort(arr, start, mid),
        mergeSort(arr, mid + 1, end)
    ]);
    merge(arr, start, mid, end);
    for (var i = start; i <= end; i++) {
        sortedIndexes[i] = 1;
    }
    await sleep(3 * sleepDuration);
    drawArray(arr);
    return
}

async function merge(arr, start, mid, end) {
    var len = (end - start) + 1;
    var result = new Array(len);

    var i = start;
    var j = mid + 1;
    var k = 0;

    var l1 = mid + 1;
    var l2 = end + 1;

    while(i < l1 && j < l2) {
        if(arr[i] < arr[j]) {
            result[k] = arr[i];
            i++;
        } else {
            result[k] = arr[j];
            j++;
        }
        
        k++;
    }

    while(i < l1) {
        result[k] = arr[i]
        i++;
        k++;
    }
    while(j < l2) {
        result[k] = arr[j]
        j++;
        k++;
    }

    for(var t = 0; t < k; t++) {
        arr[start + t] = result[t]
    }
}

async function heapSort(arr) {
    // make heap
    await makeHeap(arr);
    var heapSize = arr.length;

    for(var i = arr.length - 1; i >= 1; i--) {
        // swap ith and 0th element
        var temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;

        heapSize--;
        sortedIndexes[i] = 1;
        await maxHeapify(arr, 0, heapSize);
        await sleep(sleepDuration/2);
        drawArray(arr);
    }

    sortedIndexes[0] = 1;
}

async function makeHeap(arr) {
    for (var i = Math.floor(arr.length/2); i >=0; i--) {
        await maxHeapify(arr, i, arr.length);
    }
}

async function maxHeapify(arr, idx, heapSize) {
    if(idx >= heapSize) {
        return;
    }
    var c1 = (2 * (idx + 1)) - 1;
    var c2 = c1 + 1;

    if(c1 >= heapSize) {
        return;
    }

    var larger = c1;
    if(arr[c1] < arr[c2] && c2 < heapSize) {
        larger = c2;
    }

    if(arr[idx] < arr[larger]) {
        //swap 
        var temp = arr[idx];
        arr[idx] = arr[larger];
        arr[larger] = temp;

        await sleep(sleepDuration/2);
        drawArray(arr, larger);

        await maxHeapify(arr, larger, heapSize)
    }
}