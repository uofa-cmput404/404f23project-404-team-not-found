import base64
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import BasePermission
from socialdistribution.models import Node


class NodeAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION")

        if not auth_header or not auth_header.startswith("Basic "):
            return None

        encoded_credentials = auth_header.split(" ")[1]
        decoded_credentials = (
            base64.b64decode(encoded_credentials).decode("utf-8").split(":")
        )

        username = decoded_credentials[0]
        password = decoded_credentials[1]

        if not username or not password:
            return None

        try:
            node = Node.objects.get(
                username=username, password=password, is_active=True
            )
        except Node.DoesNotExist:
            raise AuthenticationFailed("Invalid username, password, or not allowed.")

        request.node = node  # Set the authenticated node in the request object
        return (node, None)


class NodeIsAuthenticated(BasePermission):
    """
    Allows access only to authenticated nodes.
    """

    def has_permission(self, request, view):
        # Check if the node is authenticated
        return getattr(request, "node", None) and getattr(
            request.node, "is_authenticated", False
        )
