import React, { useEffect, useState } from 'react';
import { Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import style from './style';
import LeadCard from '../components/LeadCard';

import { connectWebSocket, disconnectWebSocket } from '../services/Websocket';

const LeadScreen = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const socket = connectWebSocket(lead => {
      console.log('📱 Lead received in LeadScreen:', lead);

      setLeads(currentLeads => [lead, ...currentLeads]);
    });

    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
    <SafeAreaView style={style.container}>
      <Text style={style.title}>Leads</Text>

      <FlatList
        data={leads}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <LeadCard lead={item} />}
        ListEmptyComponent={<Text>No leads received yet...</Text>}
      />
    </SafeAreaView>
  );
};

export default LeadScreen;
