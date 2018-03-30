var plusSign = {
    type: "PLUS",
    titles: ["a", "b", "c"],
    table: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
    ],
    expected: [
        1
    ]
}

var minusSign = {
    type: "MINUS",
    titles: ["a", "b", "c"],
    table: [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    expected: [ -1, 1 ]
}

var multSign = {
    type: "MULT",
    titles: ["a", "b", "c"],
    table: [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1],
    ],
    expected: [ -1, -1, 1 ]
}

var divSign = {
    type: "DIV",
    titles: ["a", "b", "c"],
    table: [
        [0, 1, 0],
        [0, 0, 0],
        [0, 1, 0],
    ],
    expected: [ -1, -1, -1, 1 ]
}

var equalsSign = {
    type: "EQUALS",
    titles: ["a", "b", "c"],
    table: [
        [1, 1, 1],
        [0, 0, 0],
        [1, 1, 1],
    ],
    expected: [ -1, -1, -1, -1, 1 ]
}

var boxSign = {
    type: "BOX",
    titles: ["a", "b", "c"],
    table: [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
    ],
    expected: [ -1, -1, -1, -1, -1, 1 ]
}

var dotSign = {
    type: "DOT",
    titles: ["a", "b", "c"],
    table: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
    ],
    expected: [ -1, -1, -1, -1, -1, -1, 1 ]
}

var blackSign = {
    type: "BLACK",
    titles: ["a", "b", "c"],
    table: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
    ],
    expected: [ -1, -1, -1, -1, -1, -1, -1, 1 ]
}

var slashSign = {
    type: "SLASH",
    titles: ["a", "b", "c"],
    table: [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
    ],
    expected: [ -1, -1, -1, -1, -1, -1, -1, -1, 1 ]
}



////////////////

var signArray = [plusSign, minusSign, multSign, divSign, equalsSign, boxSign, dotSign, blackSign, slashSign];
var currentNetwork = null;
var timer = null;

////////////////


function display(gate) {
    var table = gate.table;
    var inputs = document.getElementById('inputs');

    document.getElementById("mySelected").innerHTML = "Selected: " + gate.type;

    var out = "";
    for (var row=0; row<table.length; row++) {
        for (var col=0; col<table[row].length; col++) {
            if (table[row][col] == 1) {
                out += "&squf;";
            } else {
                out += "&nbsp;";
            }
        }
        out += "<br>";
    }

    inputs.innerHTML = out;


}

function writeOutput() {
    var result = "<br>";
    var anyResult = true; //false;
    var output = currentNetwork.outputLayer.neurons;
    output.forEach(function(neuron, index) {
        /*var val = "";
        if (neuron.value == 1) {
            anyResult = true;
            val = signArray[index].type;
        }*/
        var val = signArray[index].type;
        while (val.length < 10) {
            val += ".";
        }
        if (neuron.value >= 0) {
            val += "<span style='color: green'>";
        } else {
            val += "<span style='color: red'>";
        }
        val += " (" + Math.round(neuron.value*100)/100 + ")";
        result += val + "</span><br>";
    });
    if (!anyResult) {
        result = "???";
    }
    document.getElementById("output").innerHTML = "Neural Network Result: " + result;
}

function toBit(n) {
    /*if (n == 1) {
        return "1";
    } else if (n == -1) {
        return "0";
    }
    return "?";*/
    return n;
}

function drawNetwork() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle="#000000";
    ctx.lineWidth = 2;

    var x = 50;
    var y = 140;

    var inputCoords = new Array();
    var hiddenCoords = new Array();
    var outputCoords = new Array();

    currentNetwork.inputLayer.neurons.forEach(function(neuron) {
        ctx.moveTo(x, y);
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        ctx.font = "30px Arial";
        ctx.fillText(toBit(neuron.value), x - 10, y + 10);

        inputCoords.push({
            x1: x,
            y1: y
        });

        y += 120;
    });

    x = 300;
    y = 100;

    currentNetwork.hiddenLayers.forEach(function(layer, index) {
        hiddenCoords.push(new Array());
        layer.neurons.forEach(function(neuron) {
            ctx.moveTo(x, y);
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, 2 * Math.PI);
            ctx.stroke();


            ctx.font = "30px Arial";
            ctx.fillText(toBit(neuron.value), x - 10, y + 10);

            hiddenCoords[index].push({
                x1: x,
                y1: y,
                weights: neuron.inputs
            });

            y += 100;
        });
        x+= 220;
    });


    y = 200;

    currentNetwork.outputLayer.neurons.forEach(function(neuron) {
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.font = "30px Arial";
        ctx.fillText(toBit(neuron.value), x - 10, y + 10);

        outputCoords.push({
            x1: x,
            y1: y,
            weights: neuron.inputs
        });

        y += 70;
    });

    inputCoords.forEach(function(input, index) {
        hiddenCoords.forEach(function(layer) {
            layer.forEach(function(hidden) {
                ctx.beginPath();
                ctx.moveTo(input.x1 + 30, input.y1);
                ctx.lineTo(hidden.x1 - 30, hidden.y1);

                var con = hidden.weights[index];

                if (con.weight < 0) {
                    ctx.strokeStyle="#FF0000";
                } else {
                    ctx.strokeStyle="#00FF00";
                }
                ctx.lineWidth = Math.abs(con.weight*10) + 2;

                ctx.stroke();
                ctx.closePath();

                var xBetween = (input.x1 + hidden.x1) / 2;
                var yBetween = (input.y1 + hidden.y1) / 2;
                ctx.font = "18px Arial";
                if (hidden.y1 < input.y1) {
                    yBetween -= 10;
                } else {
                    yBetween += 20;
                }
                ctx.fillText(Math.round(con.weight * 100) / 100, xBetween, yBetween);
            });
        });
    });

    hiddenCoords.forEach(function(hidden, index) {
        outputCoords.forEach(function(output) {
            ctx.beginPath();
            ctx.moveTo(hidden.x1 + 30, hidden.y1);
            ctx.lineTo(output.x1 - 30, output.y1);

            var con = output.weights[index];

            if (con.weight < 0) {
                ctx.strokeStyle="#FF0000";
            } else {
                ctx.strokeStyle="#00FF00";
            }
            ctx.lineWidth = Math.abs(con.weight*10) + 2;

            ctx.stroke();
            ctx.closePath();

            var xBetween = (hidden.x1 + output.x1) / 2;
            var yBetween = (hidden.y1 + output.y1) / 2;
            ctx.font = "18px Arial";
            if (output.y1 < hidden.y1) {
                yBetween -= 10;
            } else {
                yBetween += 20;
            }
            ctx.fillText(Math.round(con.weight * 100) / 100, xBetween, yBetween);
        });
    });

}

function training(gate, autoCancel = true) {

    console.log("#############");
    var finished = true;

    var inputs = [];
    for (var row=0; row<gate.table.length; row++) {
        for (var col=0; col<gate.table[row].length; col++) {
            var input = gate.table[row][col];
            if (input == 0) input = -1;
            inputs.push(input);
        }
    }
    var correctOutput = gate.expected;

    if (!currentNetwork.calculate(inputs, correctOutput)) {
        finished = false;
    }

    //writeOutput(row);

    /*if (row == showRow) {
        drawNetwork();
    }*/

    writeOutput();


    if (finished && autoCancel) {
        clearTimeout(timer);
        console.log("FINISHED");
        timer = null;
    }
    return finished;
}

function createButtons() {
    var div = document.getElementById("buttons");
    signArray.forEach(function(gate, index) {
        var button = document.createElement("button");
        var text = document.createTextNode(gate.type);
        button.appendChild(text);
        button.classList.add('btn');
        button.classList.add('btn-primary');

        button.addEventListener("click", function() {
            display(gate);
            if (currentNetwork == null) {
                currentNetwork = new Network(gate);
            }
            if (timer != null) {
                clearTimeout(timer);
            }
            timer = setInterval(function() {
                training(gate);
            }, 5);
        });

        div.appendChild(button);
    });
    var button = document.createElement("button");
    var text = document.createTextNode("Train All");
    button.appendChild(text);
    button.classList.add('btn');
    button.classList.add('btn-success');

    button.addEventListener("click", function() {
        var direction = 1;
        var i = 0;
        var amount = 0;

        if (timer != null) {
            clearTimeout(timer);
        }
        timer = setInterval(function() {
            for (var ticks=0; ticks<10; ticks++) {
                if (amount > 600) {
                    clearTimeout(timer);
                    return;
                }
                var gate = signArray[i];
                if (currentNetwork == null) {
                    currentNetwork = new Network(gate);
                }
                var finished = training(gate, false);
                display(gate);
                if (finished) {
                    i += 1 * direction;
                    if (i >= signArray.length) {
                        i = 0;
                    } else if (i < 0) {
                        i = signArray.length - 1;
                    }
                    if (Math.random() >= 0.75) {
                        direction *= -1;
                    }
                    //i = Math.floor(Math.random() * signArray.length);
                    amount++;
                } else {
                    //amount += 0.01;
                }
                if (i >= signArray.length || i < 0) {
                    direction *= -1;
                    amount++;
                }
            }
        }, 1);
    });

    div.appendChild(button);
}

window.onload = function() {
    display(plusSign);
    createButtons();
};
