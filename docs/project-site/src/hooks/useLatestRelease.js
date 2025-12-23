import { useState, useEffect } from 'react';

const REPO = 'symonxdd/epic-switcher';
const RELEASES_PAGE = `https://github.com/${REPO}/releases/latest`;

export const useLatestRelease = () => {
  const [data, setData] = useState({
    downloadUrl: RELEASES_PAGE, // Fallback
    latestReleaseUrl: RELEASES_PAGE,
    version: '...',
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`);
        if (!response.ok) throw new Error('Failed to fetch release info');

        const release = await response.json();
        const exeAsset = release.assets?.find(asset => asset.name.endsWith('.exe'));

        setData({
          downloadUrl: exeAsset ? exeAsset.browser_download_url : RELEASES_PAGE,
          latestReleaseUrl: RELEASES_PAGE,
          version: release.tag_name || '...',
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setData(prev => ({ ...prev, isLoading: false, error: err.message }));
      }
    };

    fetchRelease();
  }, []);

  return data;
};
