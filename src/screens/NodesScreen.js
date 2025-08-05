import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import * as blockchainService from '../services/blockchain';

const NodesScreen = () => {
  const [nodes, setNodes] = useState([]);
  const [nodeUrl, setNodeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const loadNodes = async () => {
    try {
      setLoading(true);
      const response = await blockchainService.getRegisteredNodes();
      setNodes(response);
    } catch (error) {
      console.error('Error loading nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNode = async () => {
    if (!nodeUrl) return;
    
    try {
      setLoading(true);
      await blockchainService.registerNode(nodeUrl);
      setNodeUrl('');
      await loadNodes();
    } catch (error) {
      console.error('Error adding node:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNodes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Nodes</Text>
      
      <View style={styles.addNodeContainer}>
        <TextInput
          style={styles.input}
          placeholder="Node URL (e.g., http://192.168.1.100:8000)"
          value={nodeUrl}
          onChangeText={setNodeUrl}
        />
        <Button 
          title="Add Node" 
          onPress={handleAddNode} 
          disabled={loading || !nodeUrl}
        />
      </View>
      
      <FlatList
        data={nodes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.nodeItem}>
            <Text>{item}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No nodes connected</Text>
        }
        refreshing={loading}
        onRefresh={loadNodes}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addNodeContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  nodeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default NodesScreen;
