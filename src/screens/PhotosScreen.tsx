import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Image,
  Modal, TextInput, StyleSheet, Alert, Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '../store/AppContext';
import { Screen, Header, EmptyState } from '../components/UI';
import { colors, spacing, radius, shadow } from '../utils/theme';
import { Photo } from '../utils/types';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - spacing.lg * 2 - spacing.sm * 2) / 3;

export default function PhotosScreen() {
  const { state, actions } = useAppContext();
  const [captionModal, setCaptionModal] = useState(false);
  const [pendingUri, setPendingUri] = useState('');
  const [caption, setCaption] = useState('');
  const [viewPhoto, setViewPhoto] = useState<Photo | null>(null);
  const [saving, setSaving] = useState(false);

  async function pickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Veuillez autoriser l\'accès à la galerie dans les paramètres.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setPendingUri(result.assets[0].uri);
      setCaptionModal(true);
    }
  }

  async function savePhoto() {
    if (!pendingUri) return;
    setSaving(true);
    await actions.addPhoto({
      uri: pendingUri,
      caption: caption.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
    });
    setSaving(false);
    setCaptionModal(false);
    setCaption('');
    setPendingUri('');
  }

  function confirmDelete(id: string) {
    Alert.alert('Supprimer', 'Supprimer cette photo ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => actions.deletePhoto(id) },
    ]);
  }

  return (
    <Screen>
      <Header
        title="Notre album 📸"
        subtitle={`${state.photos.length} souvenirs`}
        right={
          <TouchableOpacity style={styles.addBtn} onPress={pickPhoto}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        }
      />

      {state.photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState emoji="📷" message={"Ajoutez vos premiers souvenirs !\nAppuyez sur + pour commencer."} />
          <TouchableOpacity style={styles.bigAddBtn} onPress={pickPhoto}>
            <Text style={styles.bigAddBtnText}>Ajouter une photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={state.photos}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.photoItem}
              onPress={() => setViewPhoto(item)}
              onLongPress={() => confirmDelete(item.id)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.uri }} style={styles.photoImage} />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Caption modal */}
      <Modal visible={captionModal} transparent animationType="slide" onRequestClose={() => setCaptionModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Ajouter une légende</Text>
            {pendingUri ? (
              <Image source={{ uri: pendingUri }} style={styles.previewImage} />
            ) : null}
            <TextInput
              style={styles.captionInput}
              placeholder="Un souvenir à noter... (optionnel)"
              placeholderTextColor={colors.light}
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={200}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setCaptionModal(false); setCaption(''); }}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={savePhoto}
                disabled={saving}
              >
                <Text style={styles.saveText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Full photo view */}
      <Modal visible={!!viewPhoto} transparent animationType="fade" onRequestClose={() => setViewPhoto(null)}>
        <TouchableOpacity
          style={styles.photoViewOverlay}
          activeOpacity={1}
          onPress={() => setViewPhoto(null)}
        >
          {viewPhoto && (
            <View style={styles.photoViewContainer}>
              <Image source={{ uri: viewPhoto.uri }} style={styles.fullPhoto} resizeMode="contain" />
              {viewPhoto.caption ? (
                <Text style={styles.fullPhotoCaption}>{viewPhoto.caption}</Text>
              ) : null}
              <Text style={styles.fullPhotoDate}>
                {new Date(viewPhoto.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 32, height: 32, borderRadius: radius.full,
    backgroundColor: colors.rose, alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { color: colors.white, fontSize: 20, fontWeight: '300', lineHeight: 22 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  bigAddBtn: {
    backgroundColor: colors.rose, borderRadius: radius.lg,
    paddingVertical: 14, paddingHorizontal: spacing.xxl,
  },
  bigAddBtnText: { color: colors.white, fontSize: 15, fontWeight: '500' },
  grid: { padding: spacing.lg, gap: spacing.sm },
  row: { gap: spacing.sm },
  photoItem: {
    width: ITEM_SIZE, height: ITEM_SIZE,
    borderRadius: radius.md, overflow: 'hidden',
  },
  photoImage: { width: '100%', height: '100%' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: spacing.xl, gap: spacing.md, paddingBottom: 40,
  },
  modalTitle: { fontFamily: 'Georgia', fontSize: 20, color: colors.deep, textAlign: 'center' },
  previewImage: {
    width: '100%', height: 200,
    borderRadius: radius.lg,
    backgroundColor: colors.warm,
  },
  captionInput: {
    borderWidth: 1.5, borderColor: colors.warm,
    borderRadius: radius.md, padding: spacing.md,
    fontSize: 14, color: colors.deep,
    backgroundColor: colors.cream,
    minHeight: 60,
  },
  modalActions: { flexDirection: 'row', gap: spacing.md },
  cancelBtn: {
    flex: 1, padding: 14, borderRadius: radius.md,
    backgroundColor: colors.warm, alignItems: 'center',
  },
  cancelText: { fontSize: 14, color: colors.mid, fontWeight: '500' },
  saveBtn: {
    flex: 2, padding: 14, borderRadius: radius.md,
    backgroundColor: colors.rose, alignItems: 'center',
  },
  saveText: { fontSize: 14, color: colors.white, fontWeight: '500' },
  photoViewOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center', justifyContent: 'center',
  },
  photoViewContainer: { width: '100%', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  fullPhoto: { width: '100%', height: 400, borderRadius: radius.md },
  fullPhotoCaption: { fontSize: 16, color: colors.white, fontStyle: 'italic', textAlign: 'center' },
  fullPhotoDate: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
});
