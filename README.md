# AccessRoute

> Accessibility-first pedestrian navigation that finds routes based on a user's mobility needs, not just the shortest distance.

## Overview

Most navigation applications optimise routes primarily around distance and travel time. However, the shortest route is not always the most accessible route.

A route may contain stairs, steep gradients, rough surfaces, high kerbs, narrow paths, or inaccessible crossings that make it difficult or impossible for some users to navigate.

AccessRoute is a web-based accessibility-focused routing application designed to consider these factors when finding pedestrian routes.

Instead of simply asking:

> "What is the shortest route?"

AccessRoute aims to answer:

> "What is the most suitable route for this user's accessibility needs?"

---

## Project Goals

AccessRoute aims to:

- Provide accessibility-aware pedestrian navigation
- Allow users to customise their accessibility preferences
- Compare possible routes using accessibility information
- Visualise routes through an interactive map
- Prioritise accessibility alongside traditional factors such as distance
- Clearly communicate accessibility limitations and route trade-offs

---

## Accessibility Preferences

Users can specify factors that should influence their route.

Current interface preferences include:

- Avoid stairs
- Gentler slopes
- Smoother paths
- Prefer ramps
- Avoid high kerbs
- Wider paths
- Accessible crossings
- Shorter distance

These preferences will eventually be used by the routing system to evaluate and rank possible paths.

---

## Current Progress

AccessRoute is currently under development.

### Phase 1 — Frontend Foundation

- [x] Create project structure
- [x] Initialise Git repository
- [x] Connect project to GitHub
- [x] Create React frontend
- [x] Configure Vite
- [x] Build responsive user interface
- [x] Create AccessRoute branding
- [x] Add starting location input
- [x] Add destination input
- [x] Add accessibility preference interface
- [x] Add responsive styling

### Phase 2 — Interactive Map

- [x] Add Leaflet
- [x] Add React Leaflet
- [x] Create reusable `AccessMap` component
- [x] Add OpenStreetMap tile layer
- [x] Centre initial map on Melbourne
- [x] Add prototype starting-point marker
- [x] Add prototype destination marker
- [X] Connect location inputs to the map
- [X] Convert addresses into coordinates
- [X] Display selected locations dynamically
- [X] Display route paths on the map

### Phase 3 — Backend

Planned:

- [ ] Create Python backend
- [ ] Configure FastAPI
- [ ] Create API endpoints
- [ ] Connect React frontend to backend
- [ ] Add location/geocoding services
- [ ] Implement routing logic
- [ ] Return route information to frontend

### Phase 4 — Accessibility Routing

Planned:

- [ ] Build accessibility scoring model
- [ ] Incorporate accessibility preferences
- [ ] Evaluate stairs and step-free access
- [ ] Evaluate slopes
- [ ] Evaluate surface quality
- [ ] Evaluate kerbs and crossings
- [ ] Evaluate path width
- [ ] Compare alternative routes
- [ ] Generate accessibility-aware route recommendations

---

## Technology Stack

### Frontend

- React
- JavaScript
- Vite
- HTML
- CSS

### Mapping

- Leaflet
- React Leaflet
- OpenStreetMap

### Backend — Planned

- Python
- FastAPI

### Development

- Git
- GitHub
- VS Code
- npm


## How It Will Work

The intended AccessRoute workflow is:

User enters starting location
            ↓
User enters destination
            ↓
User selects accessibility preferences
            ↓
Locations are converted into coordinates
            ↓
Possible routes are generated
            ↓
Accessibility characteristics are analysed
            ↓
Routes are scored against user preferences
            ↓
Suitable route options are returned
            ↓
Route is displayed on the interactive map


For example, two routes may have different trade-offs:

## Current frontend visualisation


<img width="745" height="455" alt="image" src="https://github.com/user-attachments/assets/294d62c7-8acf-41e9-a3de-54121bad0b5f" />




<img width="710" height="339" alt="image" src="https://github.com/user-attachments/assets/d89b4a0e-4171-450d-9c52-2ec3cb2a8bae" />


## Design Philosophy

AccessRoute is being designed around four principles:

**Accessibility first**  
Accessibility should be a core routing consideration rather than an additional option added after route generation.

**Personalisation**  
Different users have different mobility requirements. There is no single definition of the "best" route.

**Transparency**  
Users should be able to understand why a route has been suggested and what accessibility limitations may exist.

**Usability**  
Accessibility information should be presented through a simple and understandable interface rather than requiring users to interpret raw mapping data.

---

## Planned Features

Future development may include:

- Address autocomplete
- Current-location detection
- Dynamic start and destination markers
- Route drawing
- Multiple route alternatives
- Accessibility scoring
- Step-free routing
- Gradient analysis
- Surface-quality analysis
- Kerb accessibility
- Accessible pedestrian crossings
- Path-width information
- Route comparison
- Accessibility warnings
- User accessibility profiles
- Route accessibility explanations

---

## Data Considerations

Accessibility routing depends heavily on the availability and accuracy of geographic accessibility data.

Relevant route attributes may include:

- Steps
- Ramps
- Surface type
- Path width
- Gradient
- Kerb type
- Pedestrian crossings
- Elevation
- Accessibility tags

A major part of the project will involve determining how these attributes can be collected, interpreted, and incorporated into the routing algorithm.

---

## Disclaimer

AccessRoute is currently a prototype and should not be relied upon as a guaranteed source of accessible navigation.

Accessibility information may be incomplete, outdated, or unavailable for some locations. Future versions of the application should clearly communicate uncertainty where reliable accessibility data is unavailable.

---

## Author

Developed by **Saanvi Dhingra**.



Current focus: **Phase 2 — Interactive mapping and location integration.**
