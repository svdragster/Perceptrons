package de.svdragster.perceptrons;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by z003p2yd on 26.03.2018.
 */
public class Neuron {

	String name;

	List<Connection> 	input 			= new ArrayList<>();
	List<Connection> 	destinations 	= new ArrayList<>();

	float value;
	float learningRate = 0.01f;

	public Neuron(String name) {
		this.name = name;
	}

	public Neuron(String name, float value) {
		this.name = name;
		this.value = value;
	}
	private float activationFunction(float t) {
		//return (float) (1 / (1 + Math.pow(Math.E, -t)));
		return t > 0.5f ? 1 : 0;
		//return Math.signum(t);
	}

	public float calculateValue(Network network) {
		float sum = network.getBias();
		for (Connection connectionIn : input) {
			//System.out.println(name + " calc -> " + connectionIn.getValue() + "  weight " + connectionIn.getWeight());
			sum += connectionIn.getValue() * connectionIn.getWeight();
		}

		value = activationFunction(sum);
		for (Connection connectionOut : destinations) {
			connectionOut.setValue(value);
		}

		return value;
	}

	public void adjustWeights(float delta, Network network) {
		for (Connection connectionIn : input) {
			connectionIn.setWeight(connectionIn.getWeight() + connectionIn.getValue() * delta * learningRate);
		}
		network.setBias(network.getBias() + learningRate * delta);
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder(name).append(": ");
		for (Connection in : input) {
			builder.append(in.getValue()).append("  ");
		}

		return builder.toString();
	}

	public List<Connection> getInput() {
		return input;
	}

	public void setInput(List<Connection> input) {
		this.input = input;
	}

	public List<Connection> getDestinations() {
		return destinations;
	}

	public void setDestinations(List<Connection> destinations) {
		this.destinations = destinations;
	}

	public float getValue() {
		return value;
	}

	public void setValue(float value) {
		this.value = value;
	}

	public String getName() {
		return name;
	}
}
