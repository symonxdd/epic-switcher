import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import styles from './ModalShared.module.css'

export default function CropAvatarModal({ image, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropChange = (crop) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom) => {
    setZoom(zoom)
  }

  const onCropCompleteInternal = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleConfirm = () => {
    if (croppedAreaPixels) {
      onCropComplete(croppedAreaPixels)
    }
  }

  return (
    <div className={styles.modalOverlay} style={{ zIndex: 6000 }}>
      {/* Increased width to accommodate the cropper comfortably */}
      <div className={`${styles.modal} ${styles.modalWide} ${styles.cropModal}`} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <h3>Crop Image</h3>

        <div style={{ padding: '0.5rem 20px 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className={styles.cropperContainer}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={onCropChange}
              onCropComplete={onCropCompleteInternal}
              onZoomChange={onZoomChange}
              classes={{
                cropAreaClassName: styles.cropperCropArea
              }}
            />
          </div>

          <div className={styles.cropperControls}>
            <div className={styles.cropperControlGroup}>
              <span className={styles.cropperControlLabel}>Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className={styles.cropperSlider}
              />
            </div>
          </div>

          <div className={styles.confirmDeleteButtons} style={{ marginTop: '0.25rem' }}>
            <button className={styles.secondaryButton} onClick={onCancel} style={{ minWidth: '100px' }}>
              Cancel
            </button>
            <button className={styles.primaryButton} onClick={handleConfirm} style={{ minWidth: '130px' }}>
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
