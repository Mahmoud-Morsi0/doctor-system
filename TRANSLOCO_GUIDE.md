
<!-- Simple translation -->
<h1>{{ 'app.title' | transloco }}</h1>

<!-- With parameters -->
<p>{{ 'validation.minLength' | transloco: { min: 5 } }}</p>

<!-- Using transloco directive (for scopes) -->
<div *transloco="let t; scope: 'dashboard'">
  <h2>{{ t('title') }}</h2>
</div>
```

### 2. Translate Text in TypeScript

```typescript
import { TranslocoService } from '@jsverse/transloco';

export class MyComponent {
  private transloco = inject(TranslocoService);
  
  // Simple translation
  getTitle(): string {
    return this.transloco.translate('app.title');
  }
  
  // With parameters
  getMessage(): string {
    return this.transloco.translate('validation.maxLength', { max: 100 });
  }
  
  // Observable (reactive)
  title$ = this.transloco.selectTranslate('app.title');
  
  // Object translation (for scopes)
  dashboard$ = this.transloco.selectTranslateObject('dashboard');
}
```

### 3. Switch Language

```typescript
import { LanguageService } from '@/app/core/services';

export class MyComponent {
  private languageService = inject(LanguageService);
  
  switchToArabic() {
    this.languageService.setLanguage('ar');
  }
  
  switchToEnglish() {
    this.languageService.setLanguage('en');
  }
  
  toggleLanguage() {
    this.languageService.toggleLanguage();
  }
}
```

## 📝 Adding New Translations

### Global Translations

Edit `src/assets/i18n/en.json` and `src/assets/i18n/ar.json`:

```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Feature description"
  }
}
```

### Feature-Specific Translations (Lazy Loading)

Create `/i18n/en/my-feature.json`:

```json
{
  "title": "My Feature",
  "actions": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

Then use in component:

```html
<div *transloco="let t; scope: 'my-feature'">
  <h1>{{ t('title') }}</h1>
  <button>{{ t('actions.save') }}</button>
</div>
```

## 🔄 Language Service API

### Methods

- `setLanguage(language: 'en' | 'ar', persist?: boolean)` - Set active language
- `toggleLanguage()` - Toggle between en/ar
- `getCurrentLanguage()` - Get current language code
- `getIsRTL()` - Check if current language is RTL

### Observables

- `language$` - Observable of current language
- `currentLanguage` - Signal of current language
- `isRTL` - Computed signal for RTL check

## 🎨 RTL/LTR Support

The LanguageService automatically:
- Updates HTML `dir` attribute
- Updates HTML `lang` attribute
- Adds/removes `rtl`/`ltr` CSS classes

Use in CSS:

```css
/* RTL-specific styles */
.rtl .my-component {
  text-align: right;
}

/* LTR-specific styles */
.ltr .my-component {
  text-align: left;
}
```

## 🔧 Configuration

### Transloco Config (`app.config.ts`)

- `defaultLang`: Fallback language ('en')
- `fallbackLang`: Language to use when translation missing ('en')
- `availableLangs`: Supported languages (['en', 'ar'])
- `reRenderOnLangChange`: Re-render components on language change (true)
- `prodMode`: Production optimizations (set to true in production)

### Language Detection

1. Checks `localStorage.getItem('language')`
2. Falls back to browser language
3. Defaults to 'en'

## 📦 Lazy Loading Feature Translations

Transloco automatically lazy loads feature translations when you use scopes:

```typescript
// This will load /assets/i18n/en/dashboard.json automatically
this.translocoService.selectTranslateObject('dashboard').subscribe(...);
```

## ✅ Best Practices

1. **Always provide both languages** - Add translations to both en.json and ar.json
2. **Use descriptive keys** - `app.title` not `title`
3. **Group related translations** - Use nested objects
4. **Use parameters** - For dynamic content: `{{ 'message' | transloco: { name: 'John' } }}`
5. **Lazy load feature translations** - Use scopes for feature-specific translations
6. **Test both languages** - Always test your app in both en and ar

## 🐛 Troubleshooting

### Translations not showing
- Check browser console for missing translation warnings
- Verify translation files are in `src/assets/i18n/`
- Ensure keys match exactly (case-sensitive)

### RTL not working
- Check LanguageService is injected
- Verify HTML `dir` attribute is updating
- Check CSS for RTL-specific styles

### Language not persisting
- Check localStorage is enabled
- Verify LanguageService.setLanguage() is called with `persist: true`

## 📚 Examples

See `src/app/features/example/example.component.ts` for complete examples.

