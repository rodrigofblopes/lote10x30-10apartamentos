# IfcOpenShell - IFC toolkit and geometry engine
# Copyright (C) 2021 Dion Moult <dion@thinkmoult.com>
#
# This file is part of IfcOpenShell.
#
# IfcOpenShell is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# IfcOpenShell is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with IfcOpenShell.  If not, see <http://www.gnu.org/licenses/>.

import ifcopenshell
import ifcopenshell.api.owner
import ifcopenshell.util.element


def unassign_product(
    file: ifcopenshell.file,
    relating_product: ifcopenshell.entity_instance,
    related_object: ifcopenshell.entity_instance,
) -> None:
    """Unassigns a product and an object (typically an annotation)

    Smart annotation objects can be associated with products so that they
    can annotate attributes and properties. This function lets you remove
    the association, so that you may change the assocation with another
    object later or leave the annotation as a "dumb" annotation.

    :param relating_product: The IfcProduct the object is related to
    :param related_object: The object (typically IfcAnnotation) that the
        product is related to
    :return: None

    Example:

    .. code:: python

        furniture = ifcopenshell.api.root.create_entity(model, ifc_class="IfcFurniture")
        annotation = ifcopenshell.api.root.create_entity(model, ifc_class="IfcAnnotation")
        ifcopenshell.api.drawing.assign_product(model,
            relating_product=furniture, related_object=annotation)

        # Let's change our mind and remove the relationship
        ifcopenshell.api.drawing.unassign_product(model,
            relating_product=furniture, related_object=annotation)
    """
    if relating_product.is_a("IfcGridAxis"):
        grid = None
        for attribute in ("PartOfW", "PartOfV", "PartOfU"):
            if getattr(relating_product, attribute, None):
                grid = getattr(relating_product, attribute)[0]
                break
        relating_product = grid

    for rel in related_object.HasAssignments or []:
        if not rel.is_a("IfcRelAssignsToProduct") or rel.RelatingProduct != relating_product:
            continue
        if len(rel.RelatedObjects) == 1:
            history = rel.OwnerHistory
            file.remove(rel)
            if history:
                ifcopenshell.util.element.remove_deep2(file, history)
            return
        related_objects = list(rel.RelatedObjects)
        related_objects.remove(related_object)
        rel.RelatedObjects = related_objects
        ifcopenshell.api.owner.update_owner_history(file, element=rel)
