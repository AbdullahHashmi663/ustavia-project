/**
 * Jest can't load `@nestjs/jwt`'s real dist — its package.json declares
 * `"type": "module"`, pure ESM, which ts-jest's CommonJS transform can't
 * parse (`Cannot use import statement outside a module`). Node itself
 * handles this fine at runtime (the actual app never hits this), but
 * `AuthService`'s constructor still needs a real, non-type-only import of
 * `JwtService` for Nest's `emitDecoratorMetadata`-based DI to see its
 * type — so a genuine mock stands in for it in tests instead, mapped via
 * `moduleNameMapper` in package.json's jest config. Every spec that needs
 * `AuthService` supplies its own fake `{ sign: () => '...' }` object
 * directly rather than relying on this class, so its body doesn't matter.
 */
export class JwtService {
  sign(..._args: unknown[]): string {
    throw new Error('JwtService is mocked in tests — pass a fake { sign } directly to AuthService instead of relying on this.');
  }
}
