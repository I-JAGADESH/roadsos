import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { auth, db } from '../../config/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

const TestCon = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function checkFirebase() {
      try {
        // 1. Check if the config was even loaded
        if (!auth.app.options.projectId) {
          throw new Error("Project ID is missing. Check your .env file!");
        }

        // 2. Try a simple Firestore query to verify network/keys
        const q = query(collection(db, "_connection_test_"), limit(1));
        await getDocs(q);

        setStatus('success');
      } catch (e: any) {
        console.error(e);
        setErrorMsg(e.message);
        setStatus('error');
      }
    }

    checkFirebase();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Connection Test</Text>
      
      {status === 'loading' && (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.text}>Testing connection...</Text>
        </View>
      )}

      {status === 'success' && (
        <View style={styles.successBox}>
          <Text style={styles.statusText}>✅ Connected Successfully!</Text>
          <Text style={styles.details}>Project: {auth.app.options.projectId}</Text>
        </View>
      )}

      {status === 'error' && (
        <View style={styles.errorBox}>
          <Text style={styles.statusText}>❌ Connection Failed</Text>
          <Text style={styles.errorDetails}>{errorMsg}</Text>
          <Text style={styles.hint}>Tip: Make sure you restarted the Expo server after adding the .env file.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  text: { marginTop: 10, color: '#666' },
  successBox: { padding: 20, backgroundColor: '#e6fffa', borderRadius: 10, alignItems: 'center' },
  errorBox: { padding: 20, backgroundColor: '#fff5f5', borderRadius: 10, alignItems: 'center' },
  statusText: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  details: { color: '#2c7a7b' },
  errorDetails: { color: '#c53030', textAlign: 'center', marginBottom: 10 },
  hint: { fontSize: 12, color: '#718096', textAlign: 'center' }
});

export default TestCon
