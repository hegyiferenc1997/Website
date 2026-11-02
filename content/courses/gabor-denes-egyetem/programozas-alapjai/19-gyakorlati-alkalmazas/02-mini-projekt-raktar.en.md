---
title: Mini Project 1 – Inventory Tracker
summary: Classes, a dictionary, custom exceptions, JSON saving and tests in one small application.
minutes: 40
kind: practice
---

## The goal of the project

You need to keep track of a small shop's stock. The project ties together almost every topic of the semester: **classes** (topic 2), **dictionaries** (10), **exception handling** (12), **file handling with JSON** (13), **testing** (14) and **documentation** (15).

## Requirements

1. For a product we store: **SKU**, **name**, **unit price**, **quantity**; a product knows its own stock value.
2. New products can be **added** to the inventory – the same SKU cannot appear twice, and price and quantity cannot be negative.
3. **Receiving** (increase stock) and **issuing** (decrease it) – you cannot issue more than is in stock.
4. Every invalid operation raises a custom **`StockError`** exception with a clear message.
5. Queries: **total value**, products **running low** (below 5 by default, sorted by name).
6. **Save** to a JSON file and **load** from it.
7. A text **report** in table form.

## Plan

| Element | Implementation | Why? |
| --- | --- | --- |
| product | `@dataclass Product`, `value` property (`@property`) | little code, automatic `__init__` and `==` |
| inventory | `Inventory` class with a `dict[SKU, Product]` inside | fast lookup by SKU |
| errors | `class StockError(Exception)` | the caller handles a single exception type |
| saving | `json` + `dataclasses.asdict`, `pathlib.Path` | a human-readable format |
| loading | `@classmethod load(file)` | an "alternative constructor" |

## Step by step

1. Write the `Product` data class and the `value` property. Try it out!
2. Write the `Inventory.add` method with the checks.
3. Write a `_find` helper that raises `StockError` for an unknown SKU – `receive` and `issue` use it (DRY).
4. Then the queries (`total_value`, `running_low`), then saving/loading and the report.
5. Run a short test after every step!

```python starter
"""Inventory tracker."""
import json
from dataclasses import asdict, dataclass
from pathlib import Path


class StockError(Exception):
    """Custom exception for inventory operation errors."""


@dataclass
class Product:
    sku: str
    name: str
    unit_price: int
    quantity: int = 0
    # TODO: value property


class Inventory:
    def __init__(self) -> None:
        self.products: dict[str, Product] = {}

    def add(self, product: Product) -> None: ...
    def receive(self, sku: str, qty: int) -> None: ...
    def issue(self, sku: str, qty: int) -> None: ...
    def total_value(self) -> int: ...
    def running_low(self, limit: int = 5) -> list[str]: ...
    def save(self, file: Path) -> None: ...
    @classmethod
    def load(cls, file: Path) -> "Inventory": ...
    def report(self) -> str: ...
```

<details>
<summary>Solution</summary>

```python solution
"""Inventory tracker: adding, moving, saving products and reporting."""
import json
from dataclasses import asdict, dataclass
from pathlib import Path


class StockError(Exception):
    """Custom exception for inventory operation errors."""


@dataclass
class Product:
    """A product in the inventory."""
    sku: str
    name: str
    unit_price: int
    quantity: int = 0

    @property
    def value(self) -> int:
        """The value of the stock."""
        return self.unit_price * self.quantity


class Inventory:
    """Products tracked by SKU (in a dictionary)."""

    def __init__(self) -> None:
        self.products: dict[str, Product] = {}

    def add(self, product: Product) -> None:
        """Add a new product; the same SKU cannot appear twice."""
        if product.sku in self.products:
            raise StockError(f"Already exists: {product.sku}")
        if product.unit_price < 0 or product.quantity < 0:
            raise StockError("Price and quantity cannot be negative.")
        self.products[product.sku] = product

    def _find(self, sku: str) -> Product:
        """Look up a product; StockError for an unknown SKU."""
        try:
            return self.products[sku]
        except KeyError:
            raise StockError(f"Unknown SKU: {sku}") from None

    def receive(self, sku: str, qty: int) -> None:
        """Increase stock."""
        if qty <= 0:
            raise StockError("The quantity must be positive.")
        self._find(sku).quantity += qty

    def issue(self, sku: str, qty: int) -> None:
        """Decrease stock; you cannot issue more than is available."""
        product = self._find(sku)
        if qty <= 0:
            raise StockError("The quantity must be positive.")
        if qty > product.quantity:
            raise StockError(f"Not enough {product.name}: {product.quantity} in stock, {qty} needed.")
        product.quantity -= qty

    def total_value(self) -> int:
        """The value of the whole stock."""
        return sum(p.value for p in self.products.values())

    def running_low(self, limit: int = 5) -> list[str]:
        """Names of products with fewer than `limit` items."""
        return sorted(p.name for p in self.products.values() if p.quantity < limit)

    def save(self, file: Path) -> None:
        """Save the inventory to a JSON file."""
        data = [asdict(p) for p in self.products.values()]
        file.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    @classmethod
    def load(cls, file: Path) -> "Inventory":
        """Load an inventory from a JSON file."""
        inventory = cls()
        for data in json.loads(file.read_text(encoding="utf-8")):
            inventory.add(Product(**data))
        return inventory

    def report(self) -> str:
        """A text report in table form."""
        lines = [f"{'SKU':<8} {'Name':<12} {'Qty':>4} {'Value':>9}"]
        for p in sorted(self.products.values(), key=lambda p: p.sku):
            lines.append(f"{p.sku:<8} {p.name:<12} {p.quantity:>4} {p.value:>9}")
        lines.append(f"Total: {self.total_value()}")
        return "\n".join(lines)


if __name__ == "__main__":
    inventory = Inventory()
    inventory.add(Product("A100", "mouse", 4_000, 12))
    inventory.add(Product("A200", "keyboard", 9_000, 3))
    inventory.receive("A200", 5)
    inventory.issue("A100", 10)
    try:
        inventory.issue("A100", 5)
    except StockError as error:
        print("Error:", error)
    print(inventory.report())
    print("Running low:", inventory.running_low())

    file = Path("inventory.json")
    inventory.save(file)
    print("Reloaded:", Inventory.load(file).total_value() == inventory.total_value())
```

</details>

```python test
import tempfile

inv = Inventory()
inv.add(Product("X1", "cable", 1_000, 10))
inv.add(Product("X2", "monitor", 50_000, 1))
assert inv.total_value() == 60_000
inv.receive("X2", 2)
inv.issue("X1", 7)
assert inv.products["X1"].quantity == 3
assert inv.running_low() == ["cable", "monitor"]
for bad in [lambda: inv.issue("X1", 4), lambda: inv.issue("NONE", 1),
            lambda: inv.add(Product("X1", "duplicate", 1)), lambda: inv.receive("X1", 0)]:
    try:
        bad()
        assert False, "Expected StockError"
    except StockError:
        pass
with tempfile.TemporaryDirectory() as folder:
    file = Path(folder) / "test.json"
    inv.save(file)
    other = Inventory.load(file)
    assert other.products == inv.products
print("All checks passed!")
```

## Extension ideas

- A **menu** for the user (with `input()`): add, receive, issue, report, save, quit.
- A **log** of every stock movement (date, SKU, quantity) in a CSV file.
- **Search** by part of a name, case-insensitively.
- Rewrite the tests as a `unittest` class in a separate `test_inventory.py` file.
