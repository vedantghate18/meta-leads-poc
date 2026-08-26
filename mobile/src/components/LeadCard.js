import React from 'react';
import { View, Text } from 'react-native';
import style from './style';

const LeadCard = ({ lead }) => {
  return (
    <View style={style.card}>
      <Text style={style.name}>{lead.name}</Text>
      <Text style={style.email}>{lead.email}</Text>
      <Text style={style.phone}>{lead.phone}</Text>
    </View>
  );
};

export default LeadCard;
