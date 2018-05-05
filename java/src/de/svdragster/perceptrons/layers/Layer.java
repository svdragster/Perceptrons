package de.svdragster.perceptrons.layers;

import de.svdragster.perceptrons.Neuron;

import java.util.ArrayList;
import java.util.List;

public class Layer {
    
    private List<Neuron> neurons = new ArrayList<>();
    
    public Layer() {
    
    }
    
    public void add(Neuron neuron) {
        neurons.add(neuron);
    }
    
    public Neuron get(int i) {
        return neurons.get(i);
    }
    
    public int size() {
        return neurons.size();
    }
    
    public List<Neuron> getNeurons() {
        return neurons;
    }
    
    public void setNeurons(List<Neuron> neurons) {
        this.neurons = neurons;
    }
    
}
