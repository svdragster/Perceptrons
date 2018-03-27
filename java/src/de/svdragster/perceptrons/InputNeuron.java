package de.svdragster.perceptrons;

/**
 * Created by z003p2yd on 26.03.2018.
 */
public class InputNeuron extends Neuron {

	public InputNeuron(String name, float value) {
		super(name, value);
	}

	@Override
	public float calculateValue(Network network) {
		for (Connection connectionOut : getDestinations()) {
			connectionOut.setValue(getValue());
		}
		return getValue();
	}
}
