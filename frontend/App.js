import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Clipboard
} from 'react-native';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [tone, setTone] = useState('professional');
  const [outputContent, setOutputContent] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const API_URL = 'https://syncflow-backend-bimz.onrender.com/api/repurpose';

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Please enter source text to repurpose.');
      return;
    }
    setError('');
    setLoading(true);
    setCopied(false);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, tone: tone }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Generation failed.');

      const newContent = data.repurposed_content;
      setOutputContent(newContent);

      // Save to Session History Vault
      setHistory(prev => [
        { id: Date.now(), text: inputText, tone: tone, result: newContent },
        ...prev
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadMarkdown = (content) => {
    if (Platform.OS === 'web') {
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `syncflow-content-${Date.now()}.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('File download is optimized for web deployment.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* SaaS Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>⚡ SyncFlow</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Plan: Pro Builder (45/50 Credits)</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.tagline}>Turn one asset into multi-platform gold.</Text>

          {/* Tone Selector */}
          <Text style={styles.label}>Select Output Tone:</Text>
          <View style={styles.toneContainer}>
            {['professional', 'viral', 'technical'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.toneButton, tone === t && styles.activeToneButton]}
                onPress={() => setTone(t)}
              >
                <Text style={[styles.toneText, tone === t && styles.activeToneText]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input Section */}
          <Text style={styles.label}>Source Material (Blog post, notes, or code release):</Text>
          <TextInput
            style={styles.input}
            placeholder="Paste your long-form text here..."
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={5}
            value={inputText}
            onChangeText={setInputText}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Action Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Generate Content Suite</Text>
            )}
          </TouchableOpacity>

          {/* Output Section */}
          {outputContent ? (
            <View style={styles.outputContainer}>
              <View style={styles.outputHeaderRow}>
                <Text style={styles.outputTitle}>✨ Generated Content Suite</Text>
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => copyToClipboard(outputContent)}
                  >
                    <Text style={styles.smallButtonText}>{copied ? 'Copied! ✅' : 'Copy 📋'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => downloadMarkdown(outputContent)}
                  >
                    <Text style={styles.smallButtonText}>Export .md 📥</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.resultText}>{outputContent}</Text>
              </View>
            </View>
          ) : null}

          {/* Session History Vault Section */}
          {history.length > 0 ? (
            <View style={styles.historyContainer}>
              <Text style={styles.historySectionTitle}>📜 Session History Vault ({history.length})</Text>
              {history.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.historyCard}
                  onPress={() => {
                    setOutputContent(item.result);
                    setInputText(item.text);
                    setTone(item.tone);
                  }}
                >
                  <View style={styles.historyCardHeader}>
                    <Text style={styles.historyToneBadge}>Tone: {item.tone}</Text>
                    <Text style={styles.historyTime}>Click to restore ⚡</Text>
                  </View>
                  <Text style={styles.historySnippet} numberOfLines={2}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  logo: { fontSize: 20, fontWeight: 'bold', color: '#38bdf8' },
  badge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeText: { color: '#38bdf8', fontSize: 12, fontWeight: '600' },
  scrollContainer: { padding: 20 },
  tagline: { fontSize: 22, fontWeight: 'bold', color: '#f8fafc', marginBottom: 20, textAlign: 'center' },
  label: { color: '#94a3b8', marginBottom: 8, fontSize: 14, fontWeight: '500' },
  toneContainer: { flexDirection: 'row', marginBottom: 15, gap: 10 },
  toneButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeToneButton: { backgroundColor: '#0284c7', borderColor: '#38bdf8' },
  toneText: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
  activeToneText: { color: '#fff' },
  input: {
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    borderRadius: 8,
    padding: 15,
    textAlignVertical: 'top',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 15,
    minHeight: 110,
  },
  button: {
    backgroundColor: '#0284c7',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#f43f5e', marginBottom: 15, fontSize: 14 },
  outputContainer: { marginTop: 10, marginBottom: 20 },
  outputHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  outputTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc' },
  actionButtonsRow: { flexDirection: 'row', gap: 8 },
  smallButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  smallButtonText: { color: '#38bdf8', fontSize: 12, fontWeight: '600' },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  resultText: { color: '#e2e8f0', fontSize: 15, lineHeight: 22 },
  historyContainer: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#1e293b', paddingTop: 20 },
  historySectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc', marginBottom: 12 },
  historyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  historyCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  historyToneBadge: { color: '#38bdf8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  historyTime: { color: '#64748b', fontSize: 12 },
  historySnippet: { color: '#94a3b8', fontSize: 13 },
});
