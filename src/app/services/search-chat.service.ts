import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SearchFilter {
  dateRange?: 'all' | 'today' | 'week' | 'month' | 'year';
  category?: 'all' | 'dashboard' | 'healthcare' | 'transactions' | 'analytics';
  sortBy?: 'recent' | 'oldest' | 'alphabetical';
}

@Injectable({
  providedIn: 'root'
})
export class SearchChatService {

  private searchValueSubject = new BehaviorSubject<string>('');
  searchValue$ = this.searchValueSubject.asObservable();

  private searchFilterSubject = new BehaviorSubject<SearchFilter>({
    dateRange: 'all',
    category: 'all',
    sortBy: 'recent'
  });
  searchFilter$ = this.searchFilterSubject.asObservable();

  private searchHistorySubject = new BehaviorSubject<string[]>([]);
  searchHistory$ = this.searchHistorySubject.asObservable();

  private isSearchingSubject = new BehaviorSubject<boolean>(false);
  isSearching$ = this.isSearchingSubject.asObservable();

  constructor() {
    this.loadSearchHistory();
  }

  setSearchValue(value: string) {
    this.searchValueSubject.next(value);
    this.isSearchingSubject.next(value.trim().length > 0);
    
    // Add to search history if not empty and not already in history
    if (value.trim() && !this.searchHistorySubject.value.includes(value.trim())) {
      const currentHistory = this.searchHistorySubject.value;
      const newHistory = [value.trim(), ...currentHistory.slice(0, 9)]; // Keep last 10 searches
      this.searchHistorySubject.next(newHistory);
      this.saveSearchHistory();
    }
  }

  setSearchFilter(filter: Partial<SearchFilter>) {
    const currentFilter = this.searchFilterSubject.value;
    const newFilter = { ...currentFilter, ...filter };
    this.searchFilterSubject.next(newFilter);
  }

  clearSearch() {
    this.searchValueSubject.next('');
    this.isSearchingSubject.next(false);
  }

  clearSearchHistory() {
    this.searchHistorySubject.next([]);
    localStorage.removeItem('chatSearchHistory');
  }

  private loadSearchHistory() {
    const savedHistory = localStorage.getItem('chatSearchHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        this.searchHistorySubject.next(history);
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }

  private saveSearchHistory() {
    const history = this.searchHistorySubject.value;
    localStorage.setItem('chatSearchHistory', JSON.stringify(history));
  }

  // Search utility methods
  searchInText(text: string, searchTerm: string): boolean {
    if (!searchTerm.trim()) return true;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  }

  highlightSearchTerm(text: string, searchTerm: string): string {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  }

  // Get search suggestions based on current input
  getSearchSuggestions(input: string): string[] {
    if (!input.trim()) return [];
    
    const history = this.searchHistorySubject.value;
    const suggestions = history.filter(item => 
      item.toLowerCase().includes(input.toLowerCase())
    );
    
    // Add common search patterns
    const commonSearches = [
      'dashboard insights',
      'customer satisfaction',
      'transaction metrics',
      'healthcare analytics',
      'user activity',
      'revenue analysis',
      'performance metrics'
    ];
    
    const commonMatches = commonSearches.filter(item =>
      item.toLowerCase().includes(input.toLowerCase()) && 
      !suggestions.includes(item)
    );
    
    return [...suggestions, ...commonMatches].slice(0, 5);
  }
}
