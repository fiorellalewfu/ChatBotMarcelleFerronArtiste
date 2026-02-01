
import React from 'react';
import type { AIResponse } from '../types';
import GenericScreen from '../screens/GenericScreen';
import GalleryScreen from '../screens/GalleryScreen';
import AtelierScreen from '../screens/AtelierScreen';
import AccueilScreen from '../screens/AccueilScreen';
import AtelierHubScreen from '../screens/AtelierHubScreen';
import SouvenirsScreen from '../screens/SouvenirsScreen';
import ProjectionScreen from '../screens/ProjectionScreen';
import ChatScreen from '../screens/ChatScreen';

interface ScreenRouterProps {
  response: AIResponse;
}

const ScreenRouter: React.FC<ScreenRouterProps> = ({ response }) => {
  switch (response.screen) {
    case 'accueil':
      return <AccueilScreen response={response} />;
    case 'galerie':
      return <GalleryScreen response={response} />;
    case 'atelier_hub':
      return <AtelierHubScreen response={response} />;
    case 'atelier':
    case 'jeu': // Let's treat jeu and atelier as the same for now
      return <AtelierScreen response={response} />;
    case 'souvenirs':
      return <SouvenirsScreen response={response} />;
    case 'projection':
      return <ProjectionScreen response={response} />;
    case 'chat':
      return <ChatScreen response={response} />;
    case 'detail_oeuvre':
    case 'citations':
    case 'resultat':
    case 'heritage':
      return <GenericScreen response={response} />;
    default:
      return <GenericScreen response={response} />;
  }
};

export default ScreenRouter;
