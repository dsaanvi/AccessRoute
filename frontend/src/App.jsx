
import { useEffect, useRef, useState } from 'react'
import {
  Accessibility,
  ArrowRight,
  ArrowUpRight,
  BusFront,
  Check,
  ChevronDown,
  MapPin,
  Menu,
  Route,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Waves,
  X,
} from 'lucide-react'

import AccessMap from './components/AccessMap'
import { searchLocation } from './services/geocoding'
import { calculateRoute } from './services/routing'
import './App.css'

function StairsIcon({ size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 27h7v-7h7v-7h7V6h5" />
      <path d="M5 5l22 22" />
    </svg>
  )
}

function AccessRouteLogo() {
  return (
    <svg
      width="43"
      height="43"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 38L20 9C22 5 26 5 28 9L41 38"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 29C20 23 27 23 33 29"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="9" r="3.5" fill="currentColor" />
      <circle cx="7" cy="38" r="3" fill="currentColor" />
      <circle cx="41" cy="38" r="3" fill="currentColor" />
    </svg>
  )
}

const preferences = [
  {
    id: 'step-free',
    label: 'Step-free access',
    icon: Accessibility,
  },
  {
    id: 'stairs',
    label: 'Avoid stairs',
    icon: StairsIcon,
  },
  {
    id: 'smooth',
    label: 'Smoother paths',
    icon: Waves,
  },
  {
    id: 'transport',
    label: 'Accessible transport',
    icon: BusFront,
  },
  {
    id: 'lighting',
    label: 'Well-lit routes',
    icon: Sun,
  },
]

// Keep outside App to prevent the input losing focus.
function LocationSearchField({
  type,
  label,
  placeholder,
  value,
  onChange,
  onSearch,
  onSelect,
  results,
  activeSearch,
  isSearching,
  onClearResults,
}) {
  const isActive = activeSearch === type

  return (
    <div className="location-search-group">
      <div className="location-input">
        <MapPin
          className={`location-icon ${
            type === 'start' ? 'start-icon' : 'destination-icon'
          }`}
          size={24}
        />

        <div className="location-input-content">
          <label htmlFor={`${type}-location`}>
            {label}
          </label>

          <input
            id={`${type}-location`}
            type="text"
            placeholder={placeholder}
            value={value}
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={
              isActive && (isSearching || results.length > 0)
            }
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onClearResults()
              }

              if (e.key === 'Enter') {
                e.preventDefault()
                onSearch(type, value, true)
              }
            }}
          />
        </div>

        <button
          type="button"
          className="location-search-button"
          aria-label={`Search ${label.toLowerCase()}`}
          onClick={() => onSearch(type, value, true)}
        >
          <Search size={20} />
        </button>
      </div>

      {isActive && isSearching && (
        <div className="location-results" role="status">
          <p className="location-search-status">
            Searching locations...
          </p>
        </div>
      )}

      {isActive && !isSearching && results.length > 0 && (
        <div className="location-results">
          {results.map((place, index) => (
            <button
              key={`${place.latitude}-${place.longitude}-${index}`}
              type="button"
              className="location-result"
              onClick={() => onSelect(place, type)}
            >
              <MapPin size={16} />
              <span>{place.name}</span>
            </button>
          ))}
        </div>
      )}

      {isActive &&
        !isSearching &&
        value.trim().length >= 3 &&
        results.length === 0 && (
          <div className="location-results" role="status">
            <p className="location-search-status">
              No matching locations found.
            </p>
          </div>
        )}
    </div>
  )
}

function App() {
  const [startLocation, setStartLocation] = useState('')
  const [destination, setDestination] = useState('')

  const [selectedPreferences, setSelectedPreferences] = useState([
    'step-free',
  ])

  const [message, setMessage] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const [searchResults, setSearchResults] = useState([])
  const [activeSearch, setActiveSearch] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const [startCoordinates, setStartCoordinates] = useState(null)
  const [destinationCoordinates, setDestinationCoordinates] =
    useState(null)

  const [route, setRoute] = useState(null)
  const [isRouting, setIsRouting] = useState(false)

  const searchController = useRef(null)
  const searchTimer = useRef(null)
  const searchVersion = useRef(0)
  const routeController = useRef(null)

  useEffect(() => {
    return () => {
      clearTimeout(searchTimer.current)
      searchController.current?.abort()
      routeController.current?.abort()
    }
  }, [])

  function cancelPendingSearch() {
    searchVersion.current += 1
    clearTimeout(searchTimer.current)
    searchController.current?.abort()
    searchController.current = null
  }

  function clearSearchResults() {
    cancelPendingSearch()
    setSearchResults([])
    setActiveSearch(null)
    setIsSearching(false)
  }

  function clearCurrentRoute() {
    routeController.current?.abort()
    routeController.current = null
    setRoute(null)
    setIsRouting(false)
  }

  function togglePreference(id) {
    clearCurrentRoute()
    setMessage("Preferences updated. Find a route to apply them.")
    setSelectedPreferences((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )
  }

  function handleLocationChange(type, value) {
    if (type === 'start') {
      setStartLocation(value)
      setStartCoordinates(null)
    } else {
      setDestination(value)
      setDestinationCoordinates(null)
    }

    clearCurrentRoute()
    setMessage('')
    handleLocationSearch(type, value)
  }

  function handleLocationSearch(type, query, immediate = false) {
    cancelPendingSearch()

    const trimmedQuery = query.trim()
    setSearchResults([])
    setMessage('')

    if (trimmedQuery.length < 3) {
      setActiveSearch(null)
      setIsSearching(false)
      return
    }

    setActiveSearch(type)
    setIsSearching(true)

    const currentVersion = searchVersion.current

    const performSearch = async () => {
      const controller = new AbortController()
      searchController.current = controller

      try {
        const results = await searchLocation(
          trimmedQuery,
          controller.signal
        )

        if (
          controller.signal.aborted ||
          currentVersion !== searchVersion.current
        ) {
          return
        }

        setSearchResults(results)
      } catch (error) {
        if (
          controller.signal.aborted ||
          currentVersion !== searchVersion.current
        ) {
          return
        }

        console.error('Location search error:', error)
        setActiveSearch(null)
        setMessage(
          'Location suggestions are unavailable. Please try again.'
        )
      } finally {
        if (
          !controller.signal.aborted &&
          currentVersion === searchVersion.current
        ) {
          setIsSearching(false)
        }
      }
    }

    if (immediate) {
      performSearch()
    } else {
      searchTimer.current = setTimeout(performSearch, 350)
    }
  }

  function selectLocation(place, type) {
    clearSearchResults()
    clearCurrentRoute()

    if (type === 'start') {
      setStartLocation(place.name)
      setStartCoordinates([
        place.latitude,
        place.longitude,
      ])
    } else {
      setDestination(place.name)
      setDestinationCoordinates([
        place.latitude,
        place.longitude,
      ])
    }

    setMessage('')
  }

  async function handleFindRoute() {
    clearSearchResults()

    if (!startCoordinates || !destinationCoordinates) {
      setMessage(
        'Please select both locations from the suggestions before planning your route.'
      )
      return
    }

    clearCurrentRoute()

    const controller = new AbortController()
    routeController.current = controller

    setIsRouting(true)
    setMessage('Calculating your walking route...')

    try {
      const result = await calculateRoute(
        startCoordinates,
        destinationCoordinates,
        selectedPreferences,
        controller.signal
      )

      if (controller.signal.aborted) return

      setRoute(result)
      setMessage('')
    } catch (error) {
      if (controller.signal.aborted) return

      console.error('Routing error:', error)
      setMessage(
        `Could not calculate route: ${error.message}`
      )
    } finally {
      if (!controller.signal.aborted) {
        setIsRouting(false)
        routeController.current = null
      }
    }
  }

  function scrollToPlanner() {
    document.getElementById('route-planner')?.scrollIntoView({
      behavior: 'smooth',
    })
    setMenuOpen(false)
  }

  return (
    <div className="site-wrapper" id="home">
      <div className="background-orb background-orb-one" />
      <div className="background-orb background-orb-two" />
      <div className="background-orb background-orb-three" />
      <div className="background-orb background-orb-four" />
      <div className="background-orb background-orb-five" />
      <div className="background-orb background-orb-six" />
      <div className="background-orb background-orb-seven" />

      <header className="site-header">
        <a className="brand" href="#home">
          <div className="brand-icon">
            <AccessRouteLogo />
          </div>
          <span>
            Access<span>Route</span>
          </span>
        </a>

        <nav
          className={`site-nav ${menuOpen ? 'nav-open' : ''}`}
          aria-label="Main navigation"
        >
          <a
            href="#home"
            className="active"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="#features"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>
          <a
            href="#route-planner"
            onClick={() => setMenuOpen(false)}
          >
            Plan
          </a>
        </nav>

        <button
          type="button"
          className="header-button"
          onClick={scrollToPlanner}
        >
          Plan a Route <ArrowRight size={18} />
        </button>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      <main className="main-layout">
        <section className="hero-panel">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              INCLUSIVE ROUTES FOR EVERY JOURNEY
            </div>

            <h1 className="hero-title">
              Explore
              <br />
              <span>Your City.</span>
              <br />
              Your <span>Way.</span>
            </h1>

            <p className="hero-description">
              The world isn't one-size-fits-all. Your routes
              shouldn't be either. Discover paths that move
              with you.
            </p>

            <div id="features" className="hero-features">
              <div className="hero-feature">
                <div className="feature-icon">
                  <Accessibility size={27} strokeWidth={1.7} />
                </div>
                <span>Step-free access</span>
              </div>

              <div className="hero-feature">
                <div className="feature-icon">
                  <StairsIcon size={27} />
                </div>
                <span>Avoid stairs</span>
              </div>

              <div className="hero-feature">
                <div className="feature-icon">
                  <Waves size={27} strokeWidth={1.7} />
                </div>
                <span>Smoother paths</span>
              </div>

              <div className="hero-feature">
                <div className="feature-icon">
                  <BusFront size={27} strokeWidth={1.7} />
                </div>
                <span>Accessible transport</span>
              </div>

              <div className="hero-feature">
                <div className="feature-icon">
                  <Sun size={27} strokeWidth={1.7} />
                </div>
                <span>Well-lit routes</span>
              </div>
            </div>

            <div id="about" className="hero-note">
              <div className="hero-note-icon">
                <Route size={24} strokeWidth={1.8} />
              </div>

              <div className="hero-note-text">
                <strong>Every journey is different.</strong>
                <span>Your route should be too.</span>
              </div>

              <ArrowUpRight
                className="hero-note-arrow"
                size={20}
              />
            </div>
          </div>
        </section>

        <section
          id="route-planner"
          className="planner-section"
        >
          <div className="planner-card">
            <div className="planner-top">
              <div>
                <p className="planner-eyebrow">
                  <SlidersHorizontal size={14} />
                  YOUR JOURNEY
                </p>

                <h2>Plan Your Route</h2>

                <p className="planner-description">
                  Enter your starting point and destination to
                  begin planning a route that works for you.
                </p>
              </div>

              <div className="planner-decoration">
                <ArrowUpRight size={23} />
              </div>
            </div>

            <div className="location-fields">
              <LocationSearchField
                type="start"
                label="Starting point"
                placeholder="e.g. Melbourne Central, VIC"
                value={startLocation}
                onChange={(value) =>
                  handleLocationChange('start', value)
                }
                onSearch={handleLocationSearch}
                onSelect={selectLocation}
                results={searchResults}
                activeSearch={activeSearch}
                isSearching={isSearching}
                onClearResults={clearSearchResults}
              />

              <div className="location-connector">
                <span />
                <span />
                <span />
              </div>

              <LocationSearchField
                type="destination"
                label="Destination"
                placeholder="e.g. Federation Square, VIC"
                value={destination}
                onChange={(value) =>
                  handleLocationChange('destination', value)
                }
                onSearch={handleLocationSearch}
                onSelect={selectLocation}
                results={searchResults}
                activeSearch={activeSearch}
                isSearching={isSearching}
                onClearResults={clearSearchResults}
              />
            </div>

            <div className="preferences-heading">
              <div>
                <h3>
                  Route preferences <span>(optional)</span>
                </h3>
              </div>

              <span className="preference-hint">
                Choose what matters to you
                <ChevronDown size={14} />
              </span>
            </div>

            <div className="preference-options">
              {preferences.map((preference) => {
                const Icon = preference.icon
                const selected = selectedPreferences.includes(
                  preference.id
                )

                return (
                  <button
                    key={preference.id}
                    type="button"
                    className={`preference-option ${
                      selected ? 'selected' : ''
                    }`}
                    onClick={() =>
                      togglePreference(preference.id)
                    }
                    aria-pressed={selected}
                  >
                    <Icon size={26} strokeWidth={1.8} />

                    {selected && (
                      <span className="selected-check">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}

                    <span>{preference.label}</span>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              className="find-route-button"
              onClick={handleFindRoute}
              disabled={isRouting}
            >
              {isRouting
                ? 'Calculating Route...'
                : 'Find Accessible Route'}
              <ArrowRight size={21} />
            </button>

            {message && (
              <p className="form-message" role="status">
                {message}
              </p>
            )}

            {route && (
              <div
                className="route-summary"
                role="status"
                style={{
                  marginTop: '16px',
                  marginBottom: '16px',
                  padding: '16px',
                  borderRadius: '14px',
                  background: 'rgba(134,231,177,0.09)',
                  border: '1px solid rgba(134,231,177,0.25)',
                  color: '#e8f8ee',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <Route size={20} color="#86e7b1" />
                  <strong>
                    {route.profile === 'wheelchair'
                    ?'Wheelchair-Profile Route Found'
                    : 'Walking Route Found'}
                    </strong>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '24px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#a7c3b2',
                      }}
                    >
                      Distance
                    </div>
                    <strong>
                      {route.distanceKm.toFixed(2)} km
                    </strong>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#a7c3b2',
                      }}
                    >
                      Estimated walking time
                    </div>
                    <strong>
                      {Math.ceil(route.durationMinutes)} min
                    </strong>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: '12px',
                    color: '#a7c3b2',
                    marginTop: '12px',
                    marginBottom: 0,
                  }}
                >
                  {route.profile === 'wheelchair'
                  ? 'Calculated using the wheelchair routing profile. Accessibility depends on available map data and has not been independantly verified'
                  : 'Calculated using standard pedestrian routing profile'}
                  </p>
              </div>
            )}

            <div className="map-preview">
              <AccessMap
                startCoordinates={startCoordinates}
                destinationCoordinates={destinationCoordinates}
                startName={startLocation}
                destinationName={destination}
                route={route}
              />

              <div className="map-overlay-label">
                <span className="map-overlay-dot" />
                {route
                  ? 'WALKING ROUTE'
                  : startCoordinates || destinationCoordinates
                    ? 'SELECTED LOCATIONS'
                    : 'MELBOURNE MAP PREVIEW'}
              </div>
            </div>

            <div className="planner-bottom">
              <ShieldCheck size={15} />
              <span>
                Route accessibility depends on available map data.
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
